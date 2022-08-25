import React from "react";
import { createConfigObserver } from "roamjs-components/components/ConfigPage";
import getBlockUidByTextOnPage from "roamjs-components/queries/getBlockUidByTextOnPage";
import getPageUidByPageTitle from "roamjs-components/queries/getPageUidByPageTitle";
import getShallowTreeByParentUid from "roamjs-components/queries/getShallowTreeByParentUid";
import { OnloadArgs } from "roamjs-components/types";
import createTagRegex from "roamjs-components/util/createTagRegex";
import registerSmartBlocksCommand from "roamjs-components/util/registerSmartBlocksCommand";
import createBlock from "roamjs-components/writes/createBlock";
import deleteBlock from "roamjs-components/writes/deleteBlock";

import { TodoistFilterPanel } from "../components/todoist-filter-panel";

import { completeTask } from "./features/complete-task";
import { pullTasks } from "./features/pull-tasks";
import { getTodoistFilterConfigs } from "./features/pull-tasks/get-todoist-filter-configs";
import { pullQuickCapture } from "./features/quick-capture";
import { syncCompleted } from "./features/sync-completed";

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

type RoamistWorkflow = { title: string; contents: string[] };
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
      contents: ["<%ROAMIST_SYNC_COMPLETED%>"],
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

export const onload = async (extensionAPI: OnloadArgs["extensionAPI"]) => {
  createConfigObserver({
    title: "roam/roamist",
    config: {
      tabs: [],
    },
  }).then(() => {
    const WORKFLOW_SECTION_NAME = "workflows";
    const roamistWorkflows = createRoamistWorkflows(extensionAPI);
    const existingWorkflows = getExistingWorkflows();
    const installWorkflow = async () => {
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
          getShallowTreeByParentUid(workflowTitleUid).map(
            ({ uid: childUid }) => {
              return deleteBlock(childUid);
            }
          )
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
      }

      console.log(
        "<<<<<<<<<<<<<<<<<<<<< roamist >>>>>>>>>>>>>>>>>>>>> setup finished."
      );
    };

    installWorkflow();
    // eslint-disable-next-line
    console.log("load roamist...");
    extensionAPI.settings.panel.create({
      tabTitle: "Roamist",
      settings: [
        {
          id: "todoist-token",
          name: "Todoist's token",
          description:
            "todoist's token. Get in todoist.com/prefs/integrations.",
          action: {
            type: "input",
            placeholder: "",
          },
        },
        {
          id: "todoist-filter-configs",
          name: "Todoist filters",
          description:
            "Todoist filters. See https://todoist.com/help/articles/205248842.",
          action: {
            type: "reactComponent",
            component: () => (
              <TodoistFilterPanel
                extensionAPI={extensionAPI}
              ></TodoistFilterPanel>
            ),
          },
        },
        {
          id: "hide-priority",
          name: "Hide priority",
          description: "Hide priority like `#priority/p1` in pulled blocks.",
          action: {
            type: "switch",
          },
        },
        {
          id: "quick-capture-filter",
          name: "Todoist's filter for quick capture",
          description: "See https://todoist.com/help/articles/205248842.",
          action: {
            type: "input",
            placeholder: "",
          },
        },
      ],
    });

    // register command
    registerSmartBlocksCommand({
      text: "ROAMIST_COMPLETE_TASK",
      handler: (context) => async () => {
        await completeTask({ extensionAPI, targetUid: context.targetUid });
        return "";
      },
    });
    registerSmartBlocksCommand({
      text: "ROAMIST_SYNC_COMPLETED",
      handler: () => async () => {
        await syncCompleted({ extensionAPI });
        return "";
      },
    });
    registerSmartBlocksCommand({
      text: "ROAMIST_QUICK_CAPTURE",
      handler: (context) => async () => {
        await pullQuickCapture({ extensionAPI, targetUid: context.targetUid });
        return "";
      },
    });
    registerSmartBlocksCommand({
      text: "ROAMIST_PULL_TASKS",
      handler: (context) => async (todoistFilter, onlyDiff) => {
        await pullTasks({
          extensionAPI,
          todoistFilter,
          onlyDiff: onlyDiff === "true",
          targetUid: context.targetUid,
        });
        return "";
      },
    });
  });
};
