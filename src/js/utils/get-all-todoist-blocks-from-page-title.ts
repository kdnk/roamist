/* eslint-disable no-useless-escape */
import { TAG_NAME } from "../constants";
import { Block } from "../type";

export const getAllTodoistBlocksFromPageTitle = async (pageTitle: string) => {
  const rule =
    "[[(ancestor ?b ?a)[?a :block/children ?b]][(ancestor ?b ?a)[?parent :block/children ?b ](ancestor ?parent ?a) ]]";

  const query = `[:find  (pull ?block [:block/uid :block/string])
                                  :in $ ?page_title %
                                  :where
                                  [?page :node/title ?page_title]
                                  [?block :block/string ?contents]
                                  [(or
                                      [(clojure.string/includes? ?contents "#${TAG_NAME}")]
                                      [(clojure.string/includes? ?contents "#\[\[${TAG_NAME}")]
                                  )]
                                  (ancestor ?block ?page)]`;

  const results = await window.roamAlphaAPI.q(query, pageTitle, rule);
  return results as Block[][];
};
