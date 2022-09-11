import getCurrentPageUid from "roamjs-components/dom/getCurrentPageUid";
import getPageTitleByPageUid from "roamjs-components/queries/getPageTitleByPageUid";

import { getAllTodoistBlocksFromPageTitle } from "../../utils/get-all-todoist-blocks-from-page-title";

export const getTodoBlocksUnderCurrentPage = async () => {
  const currentPageUid = getCurrentPageUid();
  const currentpageTitle = getPageTitleByPageUid(currentPageUid);
  const existingBlocks = await getAllTodoistBlocksFromPageTitle(
    currentpageTitle
  );
  return existingBlocks;
};
