import getBlockUidByTextOnPage from "roamjs-components/queries/getBlockUidByTextOnPage";
import getPageUidByPageTitle from "roamjs-components/queries/getPageUidByPageTitle";
import getShallowTreeByParentUid from "roamjs-components/queries/getShallowTreeByParentUid";
import { OnloadArgs } from "roamjs-components/types";
import createTagRegex from "roamjs-components/util/createTagRegex";
import createBlock from "roamjs-components/writes/createBlock";
import deleteBlock from "roamjs-components/writes/deleteBlock";

import { getTodoistFilterConfigs } from "./features/pull-tasks/get-todoist-filter-configs";

type RoamistWorkflow = { title: string; contents: string[] };

const getExistingWorkflows: () => { name: string; uid: string }[] = () =>
  window.roamAlphaAPI
    .q(
      `[:find ?s ?u :where [?r :block/uid ?u] [?r :block/string ?s] [?r :block/refs ?p] (or [?p :node/title "SmartBlock"] [?p :node/title "42SmartBlock"])]`
    )
    .map(([text, uid]: string[]) => ({
      uid,
      name: text
        .replace(createTagRegex("SmartBlock"), "")
        .replace(createTagRegex("42SmartBlock"), "")
        .trim(),
    }));

const createRoamistWorkflows = (extensionAPI: OnloadArgs["extensionAPI"]) => {
  const completeTaskWorkflows: RoamistWorkflow[] = [
    {
      title: "Roamist - complete task",
      contents: ["<%ROAMIST_COMPLETE_TASK%>"],
    },
  ];
  const syncCompletedWorkflows: RoamistWorkflow[] = [
    {
      title: "Roamist - sync completed",
      contents: ["<%NOBLOCKOUTPUT%><%ROAMIST_SYNC_COMPLETED%>"],
    },
  ];
  const pullQuickCaptureWorkflows: RoamistWorkflow[] = [
    {
      title: "Roamist - quick capture",
      contents: ["<%ROAMIST_QUICK_CAPTURE%>"],
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
  const pullTasksWorkflows: { title: string; contents: string[] }[] =
    configs.flatMap((config) => {
      return [
        {
          title: getTitle(config.name, false),
          contents: [
            generateCommand({
              onlyDiff: "false",
              todoistFilter: config.filter,
            }),
          ],
        },
        {
          title: getTitle(config.name, true),
          contents: [
            generateCommand({ onlyDiff: "true", todoistFilter: config.filter }),
          ],
        },
      ];
    });
  return [
    ...completeTaskWorkflows,
    ...syncCompletedWorkflows,
    ...pullTasksWorkflows,
    ...pullQuickCaptureWorkflows,
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

    const workflowNameSet = new Set<string>();
    for (const workflow of existingWorkflows) {
      const isValid =
        roamistWorkflows.find((wf) => {
          return wf.title === workflow.name;
        }) !== undefined;
      if (!isValid) {
        await deleteBlock(workflow.uid);
      } else {
        if (workflowNameSet.has(workflow.name)) {
          await deleteBlock(workflow.uid);
        }
        workflowNameSet.add(workflow.name);
      }
      if (workflow.name.includes("#SmartBlock Roamist - pull")) {
        await deleteBlock(workflow.uid);
      }
    }

    for (const workflow of roamistWorkflows) {
      let workflowTitleUid = existingWorkflows.find((wf) => {
        return wf.name === workflow.title;
      })?.uid;
      if (!workflowTitleUid) {
        workflowTitleUid = await createBlock({
          node: {
            text: `#SmartBlock ${workflow.title}`,
          },
          parentUid: configWorkflowUid,
        });
      }
      await Promise.all(
        getShallowTreeByParentUid(workflowTitleUid).map(({ uid: childUid }) => {
          return deleteBlock(childUid);
        })
      );
      for (const [index, content] of workflow.contents.entries()) {
        await createBlock({
          parentUid: workflowTitleUid,
          node: {
            text: content,
          },
          order: index,
        });
      }

      console.log(
        "<<<<<<<<<<<<<<<<<<<<< roamist >>>>>>>>>>>>>>>>>>>>> workflow installation has been finished."
      );
    }
  } finally {
    installing = false;
  }
};
