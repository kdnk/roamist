import { TodoistApi } from "@doist/todoist-api-typescript";
import {
  getActiveUids,
  getTextByBlockUid,
  updateBlock,
  renderToast,
} from "roamjs-components";

import { createLogger } from "../../utils/create-loagger";
import { getRoamistSetting } from "../../utils/get-roamist-setting";
import { getTodoistIdFromBlock } from "../../utils/get-todoist-id-from-block";

const token = getRoamistSetting("token");
const api = new TodoistApi(token);

const logger = createLogger("complete-task");

export const completeTask = async (targetUid?: string) => {
  try {
    const { todoistId, text, blockUid } = getBlockInfo(targetUid);
    await api.closeTask(Number(todoistId));

    const newContent = text.replace("{{[[TODO]]}}", "{{[[DONE]]}}");
    await updateBlock({ text: newContent, uid: blockUid });

    logger("succeeded.");
    renderToast({
      id: "roamist-toast-complete-task",
      content: "Success: complete-task",
      timeout: 1000,
      intent: "success",
    });
  } catch (e) {
    logger("failed.");
    logger(e);
    renderToast({
      id: "roamist-toast-complete-task",
      content: "Failed: complete-task",
      timeout: 1000,
      intent: "warning",
    });
    throw e;
  }
};

function getBlockInfo(targetUid?: string): {
  todoistId: string;
  text: string;
  blockUid: string;
} {
  let blockUid = "";
  if (targetUid) {
    blockUid = targetUid;
    logger(`targetUid: ${targetUid}`);
  } else {
    const { blockUid } = getActiveUids();
    logger(`blockUid: ${blockUid}`);
  }

  const text = getTextByBlockUid(blockUid);
  const todoistId = getTodoistIdFromBlock(text);
  return { todoistId, text, blockUid };
}
