import updateBlock from "roamjs-components/writes/updateBlock";
import { render as renderToast } from "roamjs-components/components/Toast";
import { OnloadArgs } from "roamjs-components/types";
import getCurrentPageUid from "roamjs-components/dom/getCurrentPageUid";
import getPageTitleByPageUid from "roamjs-components/queries/getPageTitleByPageUid";

import { createLogger } from "../../utils/create-loagger";
import { getTodoistApi } from "../../todoist-api";

import { getCompletedBlockUIds } from "./get-completed-block-uids";
import { getTodoBlocksWithTodoistId } from "./get-todo-blocks-with-todoist-id";
import { getTodoBlocksReferringToRoamist } from "./get-todo-blocks-referring-to-roamist";
import { getTodoBlocksUnderCurrentPage } from "./get-todo-blocks-under-current-page";

const logger = createLogger("sync-completed");

export const syncCompleted = async ({
  extensionAPI,
  onlyToday,
}: {
  extensionAPI: OnloadArgs["extensionAPI"];
  onlyToday: boolean;
}) => {
  try {
    let filter = "";
    if (onlyToday) {
      const currentPageUid = getCurrentPageUid();
      const currentPageTitle = getPageTitleByPageUid(currentPageUid);
      const date = window.roamAlphaAPI.util.pageTitleToDate(currentPageTitle);
      if (date?.toDateString() !== new Date().toDateString()) {
        throw new Error("This page isn't for Today");
      }
      filter = window.roamAlphaAPI.util.dateToPageUid(date);
    }
    const api = getTodoistApi(extensionAPI);

    const tasks = onlyToday
      ? await api.getTasks({ filter })
      : await api.getTasks();

    const activeTodoistIds = tasks.map((task) => task.id);
    const roamTodoBlocks = onlyToday
      ? await getTodoBlocksUnderCurrentPage()
      : getTodoBlocksReferringToRoamist();
    const todoistBlocks = await getTodoBlocksWithTodoistId(roamTodoBlocks);
    const completedBlocks = getCompletedBlockUIds(
      activeTodoistIds,
      todoistBlocks
    );

    for (const block of completedBlocks) {
      if (
        block === undefined ||
        block.string === undefined ||
        block.uid === undefined
      ) {
        return;
      }
      const newContent = block.string.replace("{{[[TODO]]}}", "{{[[DONE]]}}");
      await updateBlock({ text: newContent, uid: block.uid });
    }
    logger("succeeded.");
    renderToast({
      id: "roamist-toast-complete-task",
      content: "Success: sync-completed",
      timeout: 1000,
      intent: "success",
    });
  } catch (e) {
    logger("failed.");
    logger(e);
    renderToast({
      id: "roamist-toast-complete-task",
      content: `Failed: sync-completed. Error: ${e}`,
      intent: "warning",
    });
  }
};
