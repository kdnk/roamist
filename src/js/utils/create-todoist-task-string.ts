import { Project, Task } from "@doist/todoist-api-typescript";
import { OnloadArgs } from "roamjs-components/types";

import { TAG_NAME } from "../constants";

import { getTodoistIdFromUrl } from "./get-todoist-id-from-url";

export const createTodoistTaskString = ({
  extensionAPI,
  task,
  project,
}: {
  extensionAPI: OnloadArgs["extensionAPI"];
  task: Task;
  project: Project;
}) => {
  function getParsedContent(content: string) {
    const matchedLink = content.match(/\[(.*)\]\((.*)\)/);
    if (!matchedLink) {
      return content;
    } else {
      // isUrl
      const [matchedString, title, urlString] = matchedLink;
      if (
        matchedString === undefined ||
        urlString === undefined ||
        title === undefined
      ) {
        return;
      }
      const getDiff = (diffMe: string, diffBy: string) =>
        diffMe.split(diffBy).join("");
      const diff = getDiff(content, matchedString);

      const url = new URL(urlString);
      const matchedTags = [...title.matchAll(/\[(.[^\][]*)\]/g)];
      if (matchedTags.length > 0) {
        // have [] pattens
        let newTitle = title;
        let tagString = "";
        matchedTags.forEach(([origin, content]) => {
          if (origin === undefined) {
            return;
          }
          newTitle = newTitle.replace(origin, "");
          tagString = `${tagString} #[[${content}]]`;
        });
        if (!urlString.includes("bts")) {
          return `${diff}[${newTitle}](${urlString}) ${tagString}`;
        }
        return `${diff}[${newTitle}](${url.origin}${url.pathname}) ${tagString}`;
      } else {
        if (!urlString.includes("bts")) {
          return `${diff}[${title}](${urlString})`;
        }
        return `${diff}[${title}](${url.origin}${url.pathname})`;
      }
    }
  }

  let taskString = `${getParsedContent(task.content)} [🔗](${task.url})`;

  // priority
  let priority = "";
  if (task.priority == 4) {
    priority = "p1";
  } else if (task.priority == 3) {
    priority = "p2";
  } else if (task.priority == 2) {
    priority = "p3";
  } else if (task.priority == 1) {
    priority = "p4";
  }
  const hidePriority = extensionAPI.settings.get("hide-priority");
  if (!hidePriority) {
    taskString = `[[priority/${priority}]] ${taskString}`;
  }

  // add id
  const taskId = getTodoistIdFromUrl(task.url);
  if (taskId) {
    taskString = `${taskString} #Todoist/${taskId}`;
  }

  // due date
  const hideDue = extensionAPI.settings.get("hide-due");
  if (task.due && !hideDue) {
    taskString = `${taskString} [[${window.roamAlphaAPI.util.dateToPageTitle(
      new Date(task.due.date)
    )}]]`;
  }

  // project tag
  const hideProject = extensionAPI.settings.get("hide-project");
  if (!hideProject) {
    taskString = `${taskString} #[[${project.name}]]`;
  }

  taskString = `${taskString} #${TAG_NAME} `;

  return `{{[[TODO]]}} ${taskString} `;
};
