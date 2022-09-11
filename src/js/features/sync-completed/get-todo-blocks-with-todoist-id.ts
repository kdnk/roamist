import { Block } from "../../type";
import { getTodoistIdFromBlock } from "../../utils/get-todoist-id-from-block";

export const getTodoBlocksWithTodoistId = async (roamTodoBlocks: Block[][]) => {
  return roamTodoBlocks
    .map((item) => {
      const block = item[0];
      const { string } = block;
      const todoistId = getTodoistIdFromBlock(string);

      return {
        ...block,
        todoistId,
      };
    })
    .filter((block) => {
      return !!block.todoistId;
    });
};
