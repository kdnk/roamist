import { OnloadArgs } from "roamjs-components/types";

export const getTodoistToken = (extensionAPI: OnloadArgs["extensionAPI"]) => {
  return (extensionAPI.settings.get("todoist-token") as string) || "";
};
