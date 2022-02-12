import { Block } from "../type";

import { getRoamistSetting } from "./get-roamist-setting";

export const getAllTodoistBlocksFromPageTitle = async (pageTitle: string) => {
  const tagName = getRoamistSetting("tag");
  const rule =
    "[[(ancestor ?b ?a)[?a :block/children ?b]][(ancestor ?b ?a)[?parent :block/children ?b ](ancestor ?parent ?a) ]]";

  const query = `[:find  (pull ?block [:block/uid :block/string])
                                  :in $ ?page_title %
                                  :where
                                  [?page :node/title ?page_title]
                                  [?block :block/string ?contents]
                                  [(clojure.string/includes? ?contents "#${tagName}")]
                                  (ancestor ?block ?page)]`;

  const results = await window.roamAlphaAPI.q(query, pageTitle, rule);
  return results as Block[][];
};
