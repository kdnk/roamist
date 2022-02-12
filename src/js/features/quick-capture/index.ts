import { Task, TodoistApi } from "@doist/todoist-api-typescript";
import {
  createBlock,
  getActiveUids,
  getBasicTreeByParentUid,
  getPageUidByPageTitle,
} from "roamjs-components";
import { CONFIG } from "../../constants";
import { createDescriptionBlock } from "../../utils/create-description-block";
import { createLogger } from "../../utils/create-loagger";
import { getRoamistSetting } from "../../utils/get-roamist-setting";

const token = getRoamistSetting("token");
const api = new TodoistApi(token);
const tagName = getRoamistSetting("tag");

const logger = createLogger("quick-capture");

export const pullQuickCapture = async () => {
  try {
    console.log("[index.ts:15] tagName: ", tagName);
    const filter = getFilter();
    if (!filter) {
      logger("no filter");
      return;
    }
    const tasks = await api.getTasks({ filter });

    const { parentUid } = getActiveUids();
    for (const [index, task] of tasks.entries()) {
      const taskBlockUid = await createBlock({
        parentUid,
        order: index,
        node: { text: createTaskString(task) },
      });

      // add description
      if (task.description) {
        await createDescriptionBlock({
          description: task.description,
          taskBlockUid,
        });
      }
    }

    await Promise.all(
      tasks.map((task) => {
        return api.closeTask(task.id);
      })
    );
    logger("succeeded");
  } catch (e) {
    logger("failed");
    logger(e);
  }
};

function getFilter() {
  const pageUid = getPageUidByPageTitle(CONFIG);
  const config = getBasicTreeByParentUid(pageUid);
  console.log("[index.ts:19] config: ", config);
  const filter = config
    .find((node) => {
      return node.text === "quick-capture";
    })
    ?.children.find((node) => {
      return node.text === "filter";
    })?.children[0]?.text;
  return filter;
}

function createTaskString(task: Task) {
  const date = task.created.split("T")[0];
  let taskString = task.content;
  if (date) {
    taskString += ` ${date}`;
  }
  taskString += `#[[${tagName}]]`;
  return taskString;
}
