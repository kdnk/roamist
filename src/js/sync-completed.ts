/* eslint-disable @typescript-eslint/no-explicit-any */

import { TodoistApi } from "@doist/todoist-api-typescript";

const api = new TodoistApi(window.TODOIST_TOKEN);

export const syncCompleted = async () => {
  const getTodoBlocksReferringToThisPage = async (title: string) => {
    try {
      return await window.roamAlphaAPI.q(`
        [:find (pull ?refs [:block/string :block/uid {:block/children ...}])
          :where [?refs :block/refs ?title][?refs :block/refs ?todoTitle][?todoTitle :node/title "TODO"][?title :node/title "${title}"]]`);
    } catch (e) {
      console.log("error in getTodoBlocksReferringToThisPage: ", e);
      return [];
    }
  };

  const getTodoBlocksWithTodoistId = async () => {
    const roamTodoBlocks = await getTodoBlocksReferringToThisPage(
      window.Roamist.TODOIST_TAG_NAME
    );
    return roamTodoBlocks.map((item: any) => {
      const block = item[0];
      const { string } = block;
      const todoistId = string.match(/\d{10}/)[0];
      return {
        ...block,
        todoistId,
      };
    });
  };

  const getCompletedBlockUIds = (
    activeTodoistIds: any,
    roamTodoist: any
  ) => {
    const completedBlocks = roamTodoist.filter(
      ({ todoistId }: { todoistId: string }) => {
        return !activeTodoistIds.includes(Number(todoistId));
      }
    );
    return completedBlocks;
  };

  const tasks = await api.getTasks();
  const activeTodoistIds = tasks.map((task: any) => task.id);
  const roamTodoist = await getTodoBlocksWithTodoistId();
  const completedBlocks = getCompletedBlockUIds(
    activeTodoistIds,
    roamTodoist
  );

  for (const block of completedBlocks) {
    const newContent = block.string.replace(
      "{{[[TODO]]}}",
      "{{[[DONE]]}}"
    );
    await roam42.common.updateBlock(block.uid, newContent);
  }

  return "";
};
