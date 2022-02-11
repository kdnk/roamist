import { getTodoBlocksWithTodoistId } from "./get-todo-blocks-with-todoist-id";

export const getCompletedBlockUIds = (
  activeTodoistIds: number[],
  todoistBlocks: Awaited<ReturnType<typeof getTodoBlocksWithTodoistId>>
) => {
  const completedBlocks = todoistBlocks.filter(({ todoistId }) => {
    return !activeTodoistIds.includes(Number(todoistId));
  });
  return completedBlocks;
};
