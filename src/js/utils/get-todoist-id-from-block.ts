import { createLogger } from "./create-loagger";

const logger = createLogger("get-todoist-id-from-block");
export const getTodoistIdFromBlock = (text: string) => {
  try {
    const matched = text.match(/Todoist\/\d{10}/);
    logger(`matched: ${matched}`);
    if (!matched) {
      logger(`TodoistId is not found.`);
      return "";
    }
    const todoistId = matched[0]?.replace("Todoist/", "");
    return todoistId ?? "";
  } catch (e) {
    console.warn(e);
    return "";
  }
};
