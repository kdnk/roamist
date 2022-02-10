/* eslint-disable @typescript-eslint/no-explicit-any */

import { TodoistApi } from "@doist/todoist-api-typescript";
import { updateBlock } from "roamjs-components";
import { createLogger } from "../../utils/create-loagger";
import { getCompletedBlockUIds } from "./get-completed-block-uids";
import { getTodoBlocksWithTodoistId } from "./get-todo-blocks-with-todoist-id";

const api = new TodoistApi(window.TODOIST_TOKEN);
const logger = createLogger("sync-completed");

export const syncCompleted = async () => {
  try {
    const tasks = await api.getTasks();
    const activeTodoistIds = tasks.map((task: any) => task.id);
    const roamTodoist = await getTodoBlocksWithTodoistId();
    const completedBlocks = getCompletedBlockUIds(
      activeTodoistIds,
      roamTodoist
    );

    for (const block of completedBlocks) {
      const newContent = block.string.replace("{{[[TODO]]}}", "{{[[DONE]]}}");
      await updateBlock({ text: newContent, uid: block.uid });
    }
    logger("succeeded.");
  } catch (e) {
    logger("failed.");
    logger(e);
  }
};
