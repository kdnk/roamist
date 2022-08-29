import { TodoistApi } from "@doist/todoist-api-typescript";
import { OnloadArgs } from "roamjs-components/types";

export const getTodoistApi = (extensionAPI: OnloadArgs["extensionAPI"]) => {
  const token = (extensionAPI.settings.get("todoist-token") as string) || "";

  const api = new TodoistApi(token);
  if (!token) {
    throw new Error("Todoist's token is not configured.");
  }
  return api;
};
