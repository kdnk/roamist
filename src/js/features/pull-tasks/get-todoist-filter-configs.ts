import { OnloadArgs } from "roamjs-components/types";

export const getTodoistFilterConfigs = (
  extensionAPI: OnloadArgs["extensionAPI"]
) => {
  const value =
    (extensionAPI.settings.get("todoist-filter-configs") as {
      name: string;
      filter: string;
    }[]) || [];
  return value;
};
