/* eslint-disable @typescript-eslint/no-explicit-any */
export const getCompletedBlockUIds = (
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
