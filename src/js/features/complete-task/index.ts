import { TodoistApi } from "@doist/todoist-api-typescript";
import {
  getActiveUids,
  getTextByBlockUid,
  updateBlock,
} from "roamjs-components";

import { createLogger } from "../../utils/create-loagger";

const api = new TodoistApi(window.TODOIST_TOKEN);

const logger = createLogger("complete-task");

export const completeTask = async () => {
  try {
    const { blockUid } = getActiveUids();
    const text = getTextByBlockUid(blockUid);
    const matched = text.match(/\d{10}/);
    logger(`matched: ${matched}}`);
    if (!matched) {
      logger(`text: ${text}`);
      logger(`This block (${blockUid}) hasn't todoist id.`);
      return;
    }

    const todoistId = matched[0];
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
