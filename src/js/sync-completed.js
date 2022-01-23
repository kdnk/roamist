/* vim: set sw=2 sts=2 ts=2 et: */

window.RTI.syncCompleted = async () => {
  const getActiveTodoistIds = async () => {
    const url = "https://api.todoist.com/rest/v1/tasks";
    const bearer = "Bearer " + window.TODOIST_TOKEN;
    const tasks = await fetch(url, {
      headers: {
        Authorization: bearer,
      },
    }).then((res) => res.json());
    return tasks.map((task) => task.id);
  };

  const getTodoBlocksReferringToThisPage = async (title) => {
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
      window.RTI.TODOIST_TAG_NAME
    );
    return roamTodoBlocks.map((item) => {
      const block = item[0];
      const { string } = block;
      const todoistId = string.match(/\d{10}/)[0];
      return {
        ...block,
        todoistId,
      };
    });
  };

  const getCompletedBlockUIds = (activeTodoistIds, roamTodoist) => {
    const completedBlocks = roamTodoist.filter(({ todoistId }) => {
      return !activeTodoistIds.includes(Number(todoistId));
    });
    return completedBlocks;
  };

  const activeTodoistIds = await getActiveTodoistIds();
  const roamTodoist = await getTodoBlocksWithTodoistId();
  const completedBlocks = getCompletedBlockUIds(activeTodoistIds, roamTodoist);

  for (block of completedBlocks) {
    const newContent = block.string.replace("{{[[TODO]]}}", "{{[[DONE]]}}");
    await roam42.common.updateBlock(block.uid, newContent);
  }

  return "";
};
