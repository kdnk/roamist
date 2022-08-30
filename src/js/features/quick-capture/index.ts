import { Task } from "@doist/todoist-api-typescript";
import { render as renderToast } from "roamjs-components/components/Toast";
import deleteBlock from "roamjs-components/writes/deleteBlock";
import { OnloadArgs } from "roamjs-components/types";

import { createDescriptionBlock } from "../../utils/create-description-block";
import { createLogger } from "../../utils/create-loagger";
import { createSiblingBlock } from "../../utils/createSiblingBlock";
import { getTodoistApi } from "../../todoist-api";

const logger = createLogger("quick-capture");

export const pullQuickCapture = async ({
  extensionAPI,
  targetUid,
}: {
  extensionAPI: OnloadArgs["extensionAPI"];
  targetUid: string;
}) => {
  try {
    const api = getTodoistApi(extensionAPI);

    const filter = getFilter(extensionAPI);
    if (!filter) {
      throw new Error("Filter for quick capture hasn't been set.");
    }
    const tasks = await api.getTasks({ filter });

    let taskBlockUid: string = targetUid;
    for (const [index, task] of tasks.entries()) {
      taskBlockUid = await createSiblingBlock({
        fromUid: taskBlockUid,
        text: createTaskString(task),
      });
      if (index === 0) {
        await deleteBlock(targetUid);
      }
      // add description
      if (task.description) {
        await createDescriptionBlock({
          description: task.description,
          taskBlockUid,
        });
      }
    }

    await Promise.all(
      tasks.map((task) => {
        return api.closeTask(task.id);
      })
    );
    logger("succeeded");
    renderToast({
      id: "roamist-toast-complete-task",
      content: "Success: quick-capture",
      timeout: 1000,
      intent: "success",
    });
  } catch (e) {
    logger("failed");
    logger(e);
    renderToast({
      id: "roamist-toast-complete-task",
      content: `Failed: quick-capture. ${e}`,
      intent: "warning",
    });
  }
};

function getFilter(extensionAPI: OnloadArgs["extensionAPI"]) {
  return (extensionAPI.settings.get("quick-capture-filter") || "") as string;
}

function createTaskString(task: Task) {
  const date = window.roamAlphaAPI.util.dateToPageTitle(
    new Date(task.created.split("T")[0])
  );

  let taskString = task.content;
  if (date) {
    taskString += ` captured_at: [[${date}]]`;
  }
  taskString += ` #[[Quick Capture]]`;
  return taskString;
}
