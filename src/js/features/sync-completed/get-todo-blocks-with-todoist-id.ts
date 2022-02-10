/* eslint-disable @typescript-eslint/no-explicit-any */
export const getTodoBlocksReferringToCurrentPage = async (title: string) => {
  try {
    return await window.roamAlphaAPI.q(`
        [:find (pull ?refs [:block/string :block/uid {:block/children ...}])
          :where [?refs :block/refs ?title][?refs :block/refs ?todoTitle][?todoTitle :node/title "TODO"][?title :node/title "${title}"]]`);
  } catch (e) {
    console.log("error in getTodoBlocksReferringToCurrentPage: ", e);
    return [];
  }
};

export const getTodoBlocksWithTodoistId = async () => {
  const roamTodoBlocks = await getTodoBlocksReferringToCurrentPage(
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
