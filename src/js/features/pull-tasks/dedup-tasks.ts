/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAllTodoistBlocksFromPageTitle } from "../../utils/get-all-todoist-blocks-from-page-title";
import { getTodoistId } from "../../utils/get-todoist-id-from-url";

export async function dedupTaskList(taskList: any) {
  const currentPageUid = await roam42.common.currentPageUID();
  console.log(`[util.js:79] currentPageUid: `, currentPageUid);
  const currentpageTitle = await roam42.common.getBlockInfoByUID(
    currentPageUid
  );
  const existingBlocks = await getAllTodoistBlocksFromPageTitle(
    currentpageTitle[0][0].title
  );
  const existingTodoistIds = existingBlocks.map((item: any) => {
    const block = item[0];
    const todoistId = getTodoistId(block.string);
    return todoistId;
  });
  const newTaskList = taskList.filter((task: any) => {
    const taskId = getTodoistId(task.url);
    return !existingTodoistIds.includes(taskId);
  });
  return newTaskList;
}
