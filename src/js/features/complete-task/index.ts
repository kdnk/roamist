import { TodoistApi } from "@doist/todoist-api-typescript";
import {
  getActiveUids,
  getTextByBlockUid,
  updateBlock,
} from "roamjs-components";

import { createLogger } from "../../utils/create-loagger";
import { getRoamistSetting } from "../../utils/get-roamist-setting";
import { getTodoistIdFromBlock } from "../../utils/get-todoist-id-from-block";

const token = getRoamistSetting("token");
const api = new TodoistApi(token);

const logger = createLogger("complete-task");

export const completeTask = async () => {
  try {
    const { todoistId, text, blockUid } = getBlockInfo()
    await api.closeTask(Number(todoistId));

    const newContent = text.replace("{{[[TODO]]}}", "{{[[DONE]]}}");
    await updateBlock({ text: newContent, uid: blockUid });

    logger("succeeded.");
  } catch (e) {
    logger("failed.");
    logger(e);
    throw e;
  }
};

function getBlockInfo(): {todoistId: string, text: string, blockUid: string} {
    const { blockUid } = getActiveUids();
    logger(`blockUid: ${blockUid}`);

    const text = getTextByBlockUid(blockUid);
    const todoistId = getTodoistIdFromBlock(text);
    return { todoistId, text, blockUid }
}
