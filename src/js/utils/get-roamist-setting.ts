import getPageUidByPageTitle from "roamjs-components/queries/getPageUidByPageTitle";
import getBasicTreeByParentUid from "roamjs-components/queries/getBasicTreeByParentUid";
import getSettingValueFromTree from "roamjs-components/util/getSettingValueFromTree";

import { CONFIG } from "../constants";

type Key = "tag";

const DEFAULT_TAG_NAME = "Roamist";

export const getRoamistSetting = (key: Key) => {
  const pageUid = getPageUidByPageTitle(CONFIG);
  const config = getBasicTreeByParentUid(pageUid);
  const settingValue = getSettingValueFromTree({ tree: config, key });

  if (!settingValue) {
    if (key === "tag") {
      return window.Roamist.TODOIST_TAG_NAME || DEFAULT_TAG_NAME;
    }
  }
  return settingValue;
};
