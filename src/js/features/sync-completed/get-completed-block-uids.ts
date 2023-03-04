import { getTodoBlocksWithTodoistId } from "./get-todo-blocks-with-todoist-id";

export const getCompletedBlockUIds = (
  activeTodoistIds: string[],
  todoistBlocks: Awaited<ReturnType<typeof getTodoBlocksWithTodoistId>>
) => {
  const completedBlocks = todoistBlocks.filter((block) => {
    return !activeTodoistIds.includes(block?.todoistId || "");
  });
  return completedBlocks;
};
