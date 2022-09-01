import React from "react";
import { createConfigObserver } from "roamjs-components/components/ConfigPage";
import { OnloadArgs } from "roamjs-components/types";
import registerSmartBlocksCommand from "roamjs-components/util/registerSmartBlocksCommand";

import { TodoistFilterPanel } from "../components/todoist-filter-panel";

import { CONFIG_PAGE } from "./constants";
import { completeTask } from "./features/complete-task";
import { pullTasks } from "./features/pull-tasks";
import { pullQuickCapture } from "./features/quick-capture";
import { syncCompleted } from "./features/sync-completed";
import { installWorkflows } from "./install-workflows";

export const onload = async (extensionAPI: OnloadArgs["extensionAPI"]) => {
  createConfigObserver({
    title: CONFIG_PAGE,
    config: {
      tabs: [],
    },
  }).then(() => {
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

    // eslint-disable-next-line
    console.log("[init.tsx:107] kicked installWorkflows");
    installWorkflows(extensionAPI);
  });
};
