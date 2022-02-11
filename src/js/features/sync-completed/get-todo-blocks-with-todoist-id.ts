// eslint-disable @typescript-eslint/no-explicit-any
export const getTodoBlocksReferringToRoamist = async () => {
  const title = window.Roamist.TODOIST_TAG_NAME;
  try {
    const blocks = await window.roamAlphaAPI.q(`
        [:find (pull ?refs [:block/string :block/uid {:block/children ...}])
          :where [?refs :block/refs ?title][?refs :block/refs ?todoTitle][?todoTitle :node/title "TODO"][?title :node/title "${title}"]]`);
    return blocks as { string: string; uid: string }[][];
  } catch (e) {
    console.log("error in getTodoBlocksReferringToRoamist: ", e);
    return [];
  }
};

export const getTodoBlocksWithTodoistId = async () => {
  const roamTodoBlocks = await getTodoBlocksReferringToRoamist();
  return roamTodoBlocks.map((item) => {
    const block = item[0];
    const { string } = block;
    const matched = string.match(/\d{10}/);
    if (!matched) {
      throw "no match (getTodoBlocksWithTodoistId).";
    }
    const todoistId = matched[0];

    return {
      ...block,
      todoistId,
    };
  });
};
