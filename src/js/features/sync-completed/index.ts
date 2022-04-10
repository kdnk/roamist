import { TodoistApi } from "@doist/todoist-api-typescript";
import { renderToast, updateBlock } from "roamjs-components";

import { createLogger } from "../../utils/create-loagger";
import { getRoamistSetting } from "../../utils/get-roamist-setting";

import { getCompletedBlockUIds } from "./get-completed-block-uids";
import { getTodoBlocksWithTodoistId } from "./get-todo-blocks-with-todoist-id";

const token = getRoamistSetting("token");
const api = new TodoistApi(token);
const logger = createLogger("sync-completed");

export const syncCompleted = async () => {
  try {
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
      content: "Failed: sync-completed",
      timeout: 1000,
      intent: "warning",
    });
  }
};
