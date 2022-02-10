/* eslint-disable @typescript-eslint/no-explicit-any */
import { TodoistApi } from "@doist/todoist-api-typescript";
import { createLogger } from "../../utils/create-loagger";

const api = new TodoistApi(window.TODOIST_TOKEN);

const logger = createLogger("complete-task");

export const completeTask = async () => {
  const blockUid = roam42.common.currentActiveBlockUID();
  const blockInfo = await roam42.common.getBlockInfoByUID(blockUid);
  const block = blockInfo[0][0];
  const text = block?.string;
  const todoistId = text.match(/\d{10}/);

  try {
    await api.closeTask(todoistId);
    const newContent = block.string.replace("{{[[TODO]]}}", "{{[[DONE]]}}");
    await roam42.common.updateBlock(blockUid, newContent);
    logger("succeeded.");
  } catch (e) {
    logger("failed.");
    logger(e);
  }
};
