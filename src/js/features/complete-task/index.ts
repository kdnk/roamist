import { TodoistApi } from "@doist/todoist-api-typescript";
import { render as renderToast } from "roamjs-components/components/Toast";
import updateBlock from "roamjs-components/writes/updateBlock";
import getTextByBlockUid from "roamjs-components/queries/getTextByBlockUid";
import { OnloadArgs } from "roamjs-components/types";

import { createLogger } from "../../utils/create-loagger";
import { getTodoistIdFromBlock } from "../../utils/get-todoist-id-from-block";
import { getTodoistToken } from "../../utils/get-todoist-token";

const logger = createLogger("complete-task");

export const completeTask = async ({
  extensionAPI,
  targetUid,
}: {
  extensionAPI: OnloadArgs["extensionAPI"];
  targetUid: string;
}) => {
  try {
    const token = getTodoistToken(extensionAPI);
    const api = new TodoistApi(token);

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
      content: `Failed: complete-task. Error: ${e}`,
      timeout: 1000,
      intent: "warning",
    });
    throw e;
  }
};

function getBlockInfo(targetUid: string): {
  todoistId: string;
  text: string;
  blockUid: string;
} {
  const blockUid = targetUid;
  logger(`targetUid: ${targetUid}`);

  const text = getTextByBlockUid(blockUid);
  const todoistId = getTodoistIdFromBlock(text);
  return { todoistId, text, blockUid };
}
