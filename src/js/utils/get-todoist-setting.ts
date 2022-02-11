import {
  getBasicTreeByParentUid,
  getPageUidByPageTitle,
  getSettingValueFromTree,
} from "roamjs-components";
import { CONFIG } from "../constants";

type Key = "token" | "tag";

export const getTodoistToken = (key: Key) => {
  const pageUid = getPageUidByPageTitle(CONFIG);
  const config = getBasicTreeByParentUid(pageUid);
  const settingValue = getSettingValueFromTree({ tree: config, key });

  if (!settingValue) {
    if (key === "token") {
      return window.TODOIST_TOKEN;
    }
    if (key === "tag") {
      return window.Roamist.TODOIST_TAG_NAME;
    }
  }
  return settingValue;
};
