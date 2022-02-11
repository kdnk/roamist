import {
  getBasicTreeByParentUid,
  getPageUidByPageTitle,
} from "roamjs-components";
import { CONFIG } from "../constants";

type Key = "filters";
const CONFIG_KEY = "pull-tasks";
export const getSettingBlocksFromTree = (key: Key) => {
  const pageUid = getPageUidByPageTitle(CONFIG);
  const tree = getBasicTreeByParentUid(pageUid);

  const partialTree = tree
    .find((node) => {
      return node.text === CONFIG_KEY;
    })
    ?.children.find((node) => {
      return node.text === key;
    })?.children;
  if (!partialTree) {
    return [];
  }

  const config = partialTree.map((node) => {
    const name = node.text;
    const filter = node.children[0]?.text;
    return {
      name,
      filter,
    };
  });

  return config;
};
