import { createConfigObserver } from "roamjs-components/components/ConfigPage";
import createBlock from "roamjs-components/writes/createBlock";
import deleteBlock from "roamjs-components/writes/deleteBlock";
import getBlockUidByTextOnPage from "roamjs-components/queries/getBlockUidByTextOnPage";
import getShallowTreeByParentUid from "roamjs-components/queries/getShallowTreeByParentUid";
import getPageUidByPageTitle from "roamjs-components/queries/getPageUidByPageTitle";
import TextPanel from "roamjs-components/components/ConfigPanels/TextPanel";
import FlagPanel from "roamjs-components/components/ConfigPanels/FlagPanel";
import BlockPanel from "roamjs-components/components/ConfigPanels/BlockPanel";
import createTagRegex from "roamjs-components/util/createTagRegex";
import {
  FieldPanel,
  UnionField,
} from "roamjs-components/components/ConfigPanels/types";
import registerSmartBlocksCommand from "roamjs-components/util/registerSmartBlocksCommand";

import { completeTask } from "./features/complete-task";
import { pullTasks } from "./features/pull-tasks";
import { getPullTasksConfig } from "./features/pull-tasks/get-pull-tasks-config";
import { pullQuickCapture } from "./features/quick-capture";
import { syncCompleted } from "./features/sync-completed";

import "../css/priority.css";
import "../css/complete-task-button.css";

window.Roamist = window.Roamist || {};

window.Roamist = {
  ...window.RTI,
  ...window.Roamist,
  completeTask,
  pullTasks,
  syncCompleted,
  pullQuickCapture,
};

window.RTI = {
  completeTask,
  pullTasks,
  syncCompleted,
  pullQuickCapture,
};

console.log(
  "<<<<<<<<<<<<<<<<<<<<< roamist >>>>>>>>>>>>>>>>>>>>> window.Roamist: ",
  window.Roamist
);

createConfigObserver({
  title: "roam/roamist",
  config: {
    tabs: [
      {
        id: "home",
        fields: [
          {
            title: "token",
            description:
              "todoist's token. Get in todoist.com/prefs/integrations.",
            Panel: TextPanel as FieldPanel<UnionField>,
          },
          {
            title: "tag",
            description: "tag",
            Panel: TextPanel as FieldPanel<UnionField>,
          },
          {
            title: "[Not Implemented] show date",
            description: "[Not Implemented] show date",
            Panel: FlagPanel as FieldPanel<UnionField>,
          },
        ],
      },
      {
        id: "pull-tasks",
        fields: [
          {
            title: "Hide priority",
            description: "Hide priority like #priority/p1 in block",
            Panel: FlagPanel as FieldPanel<UnionField>,
          },
          {
            title: "filters",
            description: "Todoist's filters",
            Panel: BlockPanel as FieldPanel<UnionField>,
          },
        ],
      },
      {
        id: "quick-capture",
        fields: [
          {
            title: "filter",
            description: "Todoist's filter",
            Panel: TextPanel as FieldPanel<UnionField>,
          },
          {
            title: "tag",
            description: "Tag for Quick Capture",
            Panel: TextPanel as FieldPanel<UnionField>,
          },
        ],
      },
    ],
  },
});

export const getExistingWorkflows: () => { name: string; uid: string }[] = () =>
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
const createRoamistWorkflows = () => {
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

  const getJs = (args: {
    onlyDiff: "true" | "false";
    todoistFilter: string;
  }) => {
    return `<%ROAMIST_PULL_TASKS: ${args.todoistFilter}, ${args.onlyDiff}%>`;
  };
  const getTitle = (name: string, diff: boolean) =>
    `Roamist - pull ${name}${diff ? " (only diff)" : ""}`;
  const configs = getPullTasksConfig("filters");
  const pullTasksWorkflows: { title: string; contents: string[] }[] =
    configs.flatMap((config) => {
      return [
        {
          title: getTitle(config.name, false),
          contents: [
            getJs({ onlyDiff: "false", todoistFilter: config.filter }),
          ],
        },
        {
          title: getTitle(config.name, true),
          contents: [getJs({ onlyDiff: "true", todoistFilter: config.filter })],
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

// register command
registerSmartBlocksCommand({
  text: "ROAMIST_COMPLETE_TASK",
  handler: (context) => async () => {
    return await window.Roamist.completeTask(context.targetUid);
  },
});
registerSmartBlocksCommand({
  text: "ROAMIST_SYNC_COMPLETED",
  handler: () => async () => {
    return await window.Roamist.syncCompleted();
  },
});
registerSmartBlocksCommand({
  text: "ROAMIST_QUICK_CAPTURE",
  handler: (context) => async () => {
    return await window.Roamist.pullQuickCapture(context.targetUid);
  },
});
registerSmartBlocksCommand({
  text: "ROAMIST_PULL_TASKS",
  handler: (context) => async (todoistFilter, onlyDiff) => {
    await window.Roamist.pullTasks({
      todoistFilter,
      onlyDiff: onlyDiff === "true",
      targetUid: context.targetUid,
    });
    return "hello";
  },
});

const WORKFLOW_SECTION_NAME = "workflows";
const roamistWorkflows = createRoamistWorkflows();
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
  }

  console.log(
    "<<<<<<<<<<<<<<<<<<<<< roamist >>>>>>>>>>>>>>>>>>>>> setup finished."
  );
};

installWorkflow();
