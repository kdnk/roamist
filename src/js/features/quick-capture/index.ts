import { Task, TodoistApi } from "@doist/todoist-api-typescript";
import {
  deleteBlock,
  getActiveUids,
  getBasicTreeByParentUid,
  getPageUidByPageTitle,
} from "roamjs-components";
import { CONFIG } from "../../constants";
import { convertToRoamDate } from "../../utils/convert-date-to-roam";
import { createDescriptionBlock } from "../../utils/create-description-block";
import { createLogger } from "../../utils/create-loagger";
import { createSiblingBlock } from "../../utils/createSiblingBlock";
import { getRoamistSetting } from "../../utils/get-roamist-setting";

const token = getRoamistSetting("token");
const api = new TodoistApi(token);
const tagName = getTag();

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

    const { blockUid } = getActiveUids();
    let taskBlockUid: string = blockUid;
    for (const [index, task] of tasks.entries()) {
      taskBlockUid = await createSiblingBlock({
        fromUid: taskBlockUid,
        text: createTaskString(task),
      });
      if (index === 0) {
        await deleteBlock(blockUid);
      }
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
  const filter = config
    .find((node) => {
      return node.text === "quick-capture";
    })
    ?.children.find((node) => {
      return node.text === "filter";
    })?.children[0]?.text;
  return filter;
}

function getTag() {
  const pageUid = getPageUidByPageTitle(CONFIG);
  const config = getBasicTreeByParentUid(pageUid);
  const tag = config
    .find((node) => {
      return node.text === "quick-capture";
    })
    ?.children.find((node) => {
      return node.text === "tag";
    })?.children[0]?.text;
  return tag;
}

function createTaskString(task: Task) {
  const date = convertToRoamDate(task.created.split("T")[0]);
  let taskString = task.content;
  if (date) {
    taskString += ` [[${date}]]`;
  }
  if (tagName) {
    taskString += ` #[[tagName]]`;
  }
  taskString += ` #[[Quick Capture]]`;
  return taskString;
}
