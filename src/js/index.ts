import {
  createBlock,
  createConfigObserver,
  createTagRegex,
  deleteBlock,
  getBlockUidByTextOnPage,
  getPageUidByPageTitle,
  getShallowTreeByParentUid,
} from "roamjs-components";
import { completeTask } from "./features/complete-task";
import { pullTasks } from "./features/pull-tasks";
import { getPullTasksConfig } from "./features/pull-tasks/get-pull-tasks-config";
import { pullQuickCapture } from "./features/quick-capture";
import { syncCompleted } from "./features/sync-completed";

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

console.log("<<< roamist >>> window.Roamist: ", window.Roamist);

createConfigObserver({
  title: "roam/roamist",
  config: {
    tabs: [
      {
        id: "home",
        fields: [
          {
            type: "text",
            title: "token",
            description:
              "todoist's token. Get in todoist.com/prefs/integrations.",
          },
          {
            type: "text",
            title: "tag",
            description: "tag",
          },
          {
            type: "flag",
            title: "[Not Implemented] show date",
            description: "[Not Implemented] show date",
          },
        ],
      },
      {
        id: "pull-tasks",
        fields: [
          {
            type: "block",
            title: "filters",
            description: "Todoist's filters",
          },
        ],
      },
      {
        id: "quick-capture",
        fields: [
          {
            type: "text",
            title: "filter",
            description: "Todoist's filter",
          },
          {
            type: "text",
            title: "tag",
            description: "Tag for Quick Capture",
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

const createRoamistWorkflows = () => {
  const completeTaskWorkflows: { title: string; content: string }[] = [
    {
      title: "Roamist - complete task",
      content:
        "<%JAVASCRIPTASYNC:```javascript (async function () { await window.Roamist.completeTask(); })(); ```%>",
    },
  ];
  const syncCompletedWorkflows: { title: string; content: string }[] = [
    {
      title: "Roamist - sync completed",
      content:
        "<%JAVASCRIPTASYNC:```javascript (async function () { await window.Roamist.syncCompleted(); })(); ```%><%NOBLOCKOUTPUT%>",
    },
  ];
  const pullQuickCaptureWorkflows: { title: string; content: string }[] = [
    {
      title: "Roamist - quick capture",
      content:
        "<%JAVASCRIPTASYNC:```javascript (async function () { await window.Roamist.pullQuickCapture(); })(); ```%>",
    },
  ];

  const getJs = (args: {
    onlydiff: "true" | "false";
    todoistFilter: string;
  }) => {
    return `<%JAVASCRIPTASYNC:\`\`\`javascript (async function () { await window.Roamist.pullTasks({ todoistFilter: "${args.todoistFilter}", onlydiff: ${args.onlydiff} }); })(); \`\`\`%>`;
  };
  const getTitle = (name: string, diff: boolean) =>
    `Roamist - pull ${name}${diff ? " (only diff)" : ""}`;
  const configs = getPullTasksConfig("filters");
  const pullTasksWorkflows: { title: string; content: string }[] =
    configs.flatMap((config) => {
      return [
        {
          title: getTitle(config.name, false),
          content: getJs({ onlydiff: "false", todoistFilter: config.filter }),
        },
        {
          title: getTitle(config.name, true),
          content: getJs({ onlydiff: "true", todoistFilter: config.filter }),
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
    await createBlock({
      parentUid: workflowTitleUid,
      node: {
        text: workflow.content,
      },
    });
  }
};

installWorkflow();
