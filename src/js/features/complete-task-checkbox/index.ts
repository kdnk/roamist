import { render as renderToast } from "roamjs-components/components/Toast";
import { OnloadArgs } from "roamjs-components/types";

import { getTodoistApi } from "../../todoist-api";
import { getTodoistIdFromBlock } from "../../utils/get-todoist-id-from-block";

export let observer: MutationObserver | undefined = undefined;
export const completeTaskCheckbox = (
  extensionAPI: OnloadArgs["extensionAPI"]
) => {
  // const targetNode = document.querySelector(".roam-article");
  const targetNode = document.getElementsByClassName("roam-main")[0];
  if (!targetNode) {
    throw new Error("targetNode doesn't exist.");
  }
  const callback: MutationCallback = async (mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach(async (node) => {
        try {
          const input = node.childNodes[0]?.childNodes[0]?.childNodes[0];
          if (!input || !(input instanceof HTMLInputElement)) {
            return;
          }
          if (!input.checked) {
            return;
          }
          const span = node;
          if (!(span instanceof HTMLSpanElement)) {
            return;
          }
          const text = span.innerHTML;
          const todoistId = getTodoistIdFromBlock(text);
          if (!todoistId) {
            return;
          }
          const api = getTodoistApi(extensionAPI);
          const todoistTask = await api.getTask(Number(todoistId));
          if (todoistTask.due?.recurring) {
            const dueDate = new Date(todoistTask.due?.date);
            const today = new Date();
            if (today < dueDate) {
              renderToast({
                id: "roamist-toast-complete-task",
                content: `complete-task-checkbox: You can't complete future recurring tasks.`,
                intent: "primary",
              });
              return;
            } else {
              await api.closeTask(todoistTask.id);
            }
          } else {
            await api.closeTask(todoistTask.id);
          }
          renderToast({
            id: "complete-task-checkbox",
            content: "Success: complete-task-checkbox",
            timeout: 1000,
            intent: "success",
          });
        } catch (e) {
          renderToast({
            id: "roamist-toast-complete-task",
            content: `Failed: complete-task-checkbox. ${e}`,
            intent: "warning",
          });
        }
      });
    }
  };
  if (observer === undefined) {
    observer = new MutationObserver(callback);
  }
  const observe = () => {
    observer?.observe(targetNode, {
      subtree: true,
      childList: true,
      attributes: false,
    });
  };
  const disconnect = () => {
    observer?.disconnect();
  };
  return { observe, disconnect };
};
