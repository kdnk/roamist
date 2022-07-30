import getPageUidByPageTitle from "roamjs-components/queries/getPageUidByPageTitle";
import getBasicTreeByParentUid from "roamjs-components/queries/getBasicTreeByParentUid";
import getSettingValueFromTree from "roamjs-components/util/getSettingValueFromTree";

import { CONFIG } from "../constants";

type Key = "token" | "tag";

const DEFAULT_TAG_NAME = "Roamist";

export const getRoamistSetting = (key: Key) => {
  const pageUid = getPageUidByPageTitle(CONFIG);
  const config = getBasicTreeByParentUid(pageUid);
  const settingValue = getSettingValueFromTree({ tree: config, key });

  if (!settingValue) {
    if (key === "token") {
      return window.TODOIST_TOKEN;
    }
    if (key === "tag") {
      return window.Roamist.TODOIST_TAG_NAME || DEFAULT_TAG_NAME;
    }
  }
  return settingValue;
};
