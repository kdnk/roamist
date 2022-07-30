import { Task } from "@doist/todoist-api-typescript";
import getCurrentPageUid from "roamjs-components/dom/getCurrentPageUid";
import getPageTitleByPageUid from "roamjs-components/queries/getPageTitleByPageUid";

import { createLogger } from "../../utils/create-loagger";
import { getAllTodoistBlocksFromPageTitle } from "../../utils/get-all-todoist-blocks-from-page-title";
import { getTodoistIdFromBlock } from "../../utils/get-todoist-id-from-block";
import { getTodoistIdFromUrl } from "../../utils/get-todoist-id-from-url";

const logger = createLogger("pull-tasks");

export async function dedupTaskList(taskList: Task[]) {
  const currentPageUid = getCurrentPageUid();
  logger(`currentPageUid: ${currentPageUid}`);
  const currentpageTitle = getPageTitleByPageUid(currentPageUid);
  const existingBlocks = await getAllTodoistBlocksFromPageTitle(
    currentpageTitle
  );
  const existingTodoistIds = existingBlocks.map((item) => {
    const block = item[0];
    const todoistId = getTodoistIdFromBlock(block.string);
    return todoistId;
  });
  const newTaskList = taskList.filter((task: Task) => {
    const taskId = getTodoistIdFromUrl(task.url);
    return !existingTodoistIds.includes(taskId);
  });
  return newTaskList;
}
