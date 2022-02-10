import { Task } from "@doist/todoist-api-typescript";
import { getCurrentPageUid, getPageTitleByPageUid } from "roamjs-components";
import { createLogger } from "../../utils/create-loagger";
import { getAllTodoistBlocksFromPageTitle } from "../../utils/get-all-todoist-blocks-from-page-title";
import { getTodoistId } from "../../utils/get-todoist-id-from-url";

const logger = createLogger("pull-tasks");

export async function dedupTaskList(taskList: Task[]) {
  const currentPageUid = getCurrentPageUid();
  logger(`currentPageUid: ${currentPageUid}`);
  const currentpageTitle = getPageTitleByPageUid(currentPageUid);
  const existingBlocks = await getAllTodoistBlocksFromPageTitle(
    currentpageTitle
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const existingTodoistIds = existingBlocks.map((item: any) => {
    const block = item[0];
    const todoistId = getTodoistId(block.string);
    return todoistId;
  });
  const newTaskList = taskList.filter((task: Task) => {
    const taskId = getTodoistId(task.url);
    return !existingTodoistIds.includes(taskId);
  });
  return newTaskList;
}
