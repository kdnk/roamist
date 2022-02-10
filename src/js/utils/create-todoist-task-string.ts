/* eslint-disable @typescript-eslint/no-explicit-any */
import { convertToRoamDate } from "./convert-date-to-roam";
import { getTodoistId } from "./get-todoist-id-from-url";

export const createTodoistTaskString = ({
  task,
  project,
}: {
  task: any;
  project: any;
}) => {
  function getParsedContent(content: string) {
    const matchedLink = content.match(/\[(.*)\]\((.*)\)/);
    if (!matchedLink) {
      return content;
    } else {
      // isUrl
      const [matchedString, title, urlString] = matchedLink;
      const getDiff = (diffMe: any, diffBy: any) =>
        diffMe.split(diffBy).join("");
      const diff = getDiff(content, matchedString);

      const url = new URL(urlString);
      const matchedTags = [...title.matchAll(/\[(.[^\][]*)\]/g)];
      if (matchedTags.length > 0) {
        // have [] pattens
        let newTitle = title;
        let tagString = "";
        matchedTags.forEach(([origin, content]) => {
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
  if (task.priority == "4") {
    priority = "p1";
  } else if (task.priority == "3") {
    priority = "p2";
  } else if (task.priority == "2") {
    priority = "p3";
  } else if (task.priority == "1") {
    priority = "p4";
  }
  taskString = `#priority/${priority} ${taskString}`;

  // add id
  const taskId = getTodoistId(task.url);
  if (taskId) {
    taskString = `${taskString} #Todoist/${taskId}`;
  }

  // due date
  if (task.due) {
    taskString = `${taskString} [[${convertToRoamDate(task.due.date)}]]`;
  }

  // project tag
  taskString = `${taskString} #[[${project.name}]] #${window.Roamist.TODOIST_TAG_NAME}`;

  return `{{[[TODO]]}} ${taskString} `;
};
