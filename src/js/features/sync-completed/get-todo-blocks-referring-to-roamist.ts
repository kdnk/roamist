import { TAG_NAME } from "../../constants";
import { Block } from "../../type";

export const getTodoBlocksReferringToRoamist = () => {
  const blocks = window.roamAlphaAPI.q(`
        [:find (pull ?refs [:block/string :block/uid {:block/children ...}])
          :where [?refs :block/refs ?title][?refs :block/refs ?todoTitle][?todoTitle :node/title "TODO"][?title :node/title "${TAG_NAME}"]]`);
  return blocks as Block[][];
};
