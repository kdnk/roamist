import getBlockUidByTextOnPage from "roamjs-components/queries/getBlockUidByTextOnPage";
import getPageUidByPageTitle from "roamjs-components/queries/getPageUidByPageTitle";
import { OnloadArgs } from "roamjs-components/types";
import createTagRegex from "roamjs-components/util/createTagRegex";
import createBlock from "roamjs-components/writes/createBlock";
import deleteBlock from "roamjs-components/writes/deleteBlock";

import { getTodoistFilterConfigs } from "./features/pull-tasks/get-todoist-filter-configs";

type RoamistWorkflow = { title: string; content: string };

const getExistingWorkflows: () => { name: string; uid: string }[] = () => {
  const configPageName = "roam/roamist";
  return window.roamAlphaAPI
    .q(
      `[:find ?text ?uid
        :where
          [?workflow :block/uid ?uid]
          [?workflow :block/string ?text]
          [?workflow :block/refs ?tag]
          [?tag :node/title "SmartBlock"]
          [?configPage :node/title "${configPageName}"]
          [?workflow :block/page ?configPage]
      ]`
    )
    .map((block: string[]) => {
      const [text, uid] = block;
      return {
        uid,
        name: text
          .replace(createTagRegex("SmartBlock"), "")
          .replace(createTagRegex("42SmartBlock"), "")
          .trim(),
      };
    });
};

const createRoamistWorkflows = (extensionAPI: OnloadArgs["extensionAPI"]) => {
  const completeTaskWorkflows: RoamistWorkflow[] = [
    {
      title: "Roamist - complete task",
      content: "<%ROAMIST_COMPLETE_TASK%>",
    },
  ];
  const syncCompletedWorkflows: RoamistWorkflow[] = [
    {
      title: "Roamist - sync completed",
      content: "<%NOBLOCKOUTPUT%><%ROAMIST_SYNC_COMPLETED%>",
    },
  ];
  const pullQuickCaptureWorkflows: RoamistWorkflow[] = [
    {
      title: "Roamist - quick capture",
      content: "<%ROAMIST_QUICK_CAPTURE%>",
    },
  ];

  const generateCommand = (args: {
    onlyDiff: "true" | "false";
    todoistFilter: string;
  }) => {
    return `<%ROAMIST_PULL_TASKS: ${args.todoistFilter},${args.onlyDiff}%>`;
  };
  const getTitle = (name: string, diff: boolean) =>
    `Roamist - pull ${name}${diff ? " (only diff)" : ""}`;
  const configs = getTodoistFilterConfigs(extensionAPI);
  const pullTasksWorkflows: RoamistWorkflow[] = configs.flatMap((config) => {
    return [
      {
        title: getTitle(config.name, false),
        content: generateCommand({
          onlyDiff: "false",
          todoistFilter: config.filter,
        }),
      },
      {
        title: getTitle(config.name, true),
        content: generateCommand({
          onlyDiff: "true",
          todoistFilter: config.filter,
        }),
      },
    ];
  });
  return [
    ...completeTaskWorkflows,
    ...syncCompletedWorkflows,
    ...pullQuickCaptureWorkflows,
    ...pullTasksWorkflows,
  ];
};

const WORKFLOW_SECTION_NAME = "workflows";
let installing = false;
export const installWorkflows = async (
  extensionAPI: OnloadArgs["extensionAPI"]
) => {
  if (installing) {
    return;
  }
  try {
    installing = true;
    const roamistWorkflows = createRoamistWorkflows(extensionAPI);
    const existingWorkflows = getExistingWorkflows();
    let configWorkflowUid = getBlockUidByTextOnPage({
      text: WORKFLOW_SECTION_NAME,
      title: "roam/roamist",
    });
    if (!configWorkflowUid) {
      const pageUid = getPageUidByPageTitle("roam/roamist");
      configWorkflowUid = await createBlock({
        node: {
          text: WORKFLOW_SECTION_NAME,
        },
        parentUid: pageUid,
      });
    }

    for (const workflow of existingWorkflows) {
      await deleteBlock(workflow.uid);
    }

    for (const workflow of roamistWorkflows) {
      const workflowTitleUid = await createBlock({
        node: {
          text: `#SmartBlock ${workflow.title}`,
        },
        parentUid: configWorkflowUid,
      });
      await createBlock({
        parentUid: workflowTitleUid,
        node: {
          text: workflow.content,
        },
      });

      console.log(
        "<<<<<<<<<<<<<<<<<<<<< roamist >>>>>>>>>>>>>>>>>>>>> workflow installation has been finished."
      );
    }
  } finally {
    installing = false;
  }
};
