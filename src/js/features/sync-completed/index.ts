import { TodoistApi } from "@doist/todoist-api-typescript";
import updateBlock from "roamjs-components/writes/updateBlock";
import { render as renderToast } from "roamjs-components/components/Toast";
import { OnloadArgs } from "roamjs-components/types";

import { createLogger } from "../../utils/create-loagger";
import { getTodoistToken } from "../../utils/get-todoist-token";

import { getCompletedBlockUIds } from "./get-completed-block-uids";
import { getTodoBlocksWithTodoistId } from "./get-todo-blocks-with-todoist-id";

const logger = createLogger("sync-completed");

export const syncCompleted = async ({
  extensionAPI,
}: {
  extensionAPI: OnloadArgs["extensionAPI"];
}) => {
  try {
    const token = getTodoistToken(extensionAPI);
    const api = new TodoistApi(token);

    const tasks = await api.getTasks();
    const activeTodoistIds = tasks.map((task) => task.id);
    const todoistBlocks = await getTodoBlocksWithTodoistId();
    const completedBlocks = getCompletedBlockUIds(
      activeTodoistIds,
      todoistBlocks
    );

    for (const block of completedBlocks) {
      const newContent = block.string.replace("{{[[TODO]]}}", "{{[[DONE]]}}");
      await updateBlock({ text: newContent, uid: block.uid });
    }
    logger("succeeded.");
    renderToast({
      id: "roamist-toast-complete-task",
      content: "Success: sync-completed",
      timeout: 1000,
      intent: "success",
    });
  } catch (e) {
    logger("failed.");
    logger(e);
    renderToast({
      id: "roamist-toast-complete-task",
      content: `Failed: sync-completed. Error: ${e}`,
      intent: "warning",
    });
  }
};
