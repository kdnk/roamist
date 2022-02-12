import {
  getBasicTreeByParentUid,
  getPageUidByPageTitle,
} from "roamjs-components";
import { CONFIG } from "../../constants";

type Key = "filters";
const CONFIG_KEY = "pull-tasks";
export const getPullTasksConfig = (key: Key) => {
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

  const config = partialTree[0].children.map((node) => {
    const name = node.text;
    const filter = node.children[0]?.text;
    return {
      name,
      filter,
    };
  });

  console.log("filter config: ", config);
  return config;
};
