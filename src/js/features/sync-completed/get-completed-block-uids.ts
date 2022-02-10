export const getCompletedBlockUIds = (
  activeTodoistIds: number[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  roamTodoist: any[]
) => {
  const completedBlocks = roamTodoist.filter(({ todoistId }) => {
    return !activeTodoistIds.includes(Number(todoistId));
  });
  return completedBlocks;
};
