var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
const completeTask = async () => {
  const TODOIST_TOKEN = window.TODOIST_TOKEN;
  const blockUid = roam42.common.currentActiveBlockUID();
  const blockInfo = await roam42.common.getBlockInfoByUID(blockUid);
  const block = blockInfo[0][0];
  const text = block == null ? void 0 : block.string;
  const res = text.match(/\d{10}/);
  const url = "https://api.todoist.com/rest/v1/tasks/" + res + "/close";
  const bearer = "Bearer " + TODOIST_TOKEN;
  await fetch(url, {
    method: "POST",
    headers: {
      Authorization: bearer
    }
  });
  const newContent = block.string.replace("{{[[TODO]]}}", "{{[[DONE]]}}");
  await roam42.common.updateBlock(blockUid, newContent);
  return "";
};
const pullTasks = async ({
  todoistFilter,
  onlyDiff
}) => {
  const FILTER = encodeURIComponent(todoistFilter);
  const getTodoistTasks = async () => {
    const url = `https://api.todoist.com/rest/v1/tasks?filter=${FILTER}`;
    const bearer = "Bearer " + window.TODOIST_TOKEN;
    const tasks2 = await fetch(url, {
      headers: {
        Authorization: bearer
      }
    }).then((res) => res.json());
    return tasks2;
  };
  const createDescriptionBlock = async ({
    description,
    currentBlockUid: currentBlockUid2,
    currentIndent
  }) => {
    const descParentUid = await roam42.common.createBlock(currentBlockUid2, currentIndent + 1, `desc::`);
    let descBlockUid;
    const descList = description.split(/\r?\n/);
    for (const [descIndex, desc] of descList.entries()) {
      if (descIndex === 0) {
        descBlockUid = await roam42.common.createBlock(descParentUid, currentIndent + 2, desc);
      } else {
        descBlockUid = await roam42.common.createSiblingBlock(descBlockUid, desc);
      }
    }
  };
  const projects = await window.RTI.getTodoistProjects();
  const tasks = await getTodoistTasks();
  let taskList = tasks.filter((task) => !task.parent_id);
  if (onlyDiff) {
    taskList = await window.RTI.dedupTaskList(taskList);
  }
  taskList.sort((a, b) => {
    return b.priority - a.priority;
  });
  const subTaskList = tasks.filter((task) => task.parent_id);
  const cursorBlockUid = roam42.common.currentActiveBlockUID();
  let currentBlockUid = cursorBlockUid;
  for (const [taskIndex, task] of taskList.entries()) {
    const project = window.RTI.getTodoistProject(projects, task.project_id);
    currentBlockUid = await roam42.common.createSiblingBlock(currentBlockUid, window.RTI.createTodoistTaskString({ task, project }), true);
    if (task.description) {
      await createDescriptionBlock({
        description: task.description,
        currentBlockUid,
        currentIndent: 1
      });
    }
    const subtasks = subTaskList.filter((subtask) => subtask.parent_id === task.id);
    let currentSubBlockUid;
    for (const [subtaskIndex, subtask] of subtasks.entries()) {
      if (subtaskIndex === 0) {
        currentSubBlockUid = await roam42.common.createBlock(currentBlockUid, 1, window.RTI.createTodoistTaskString({
          task: subtask,
          project
        }));
      } else {
        currentSubBlockUid = await roam42.common.createSiblingBlock(currentSubBlockUid, window.RTI.createTodoistTaskString({
          task: subtask,
          project
        }), true);
      }
      if (subtask.description) {
        await createDescriptionBlock({
          description: subtask.description,
          currentBlockUid: currentSubBlockUid,
          currentIndent: 2
        });
      }
    }
    if (taskIndex === 0) {
      await roam42.common.deleteBlock(cursorBlockUid);
    }
  }
  return "";
};
const syncCompleted = async () => {
  const getActiveTodoistIds = async () => {
    const url = "https://api.todoist.com/rest/v1/tasks";
    const bearer = "Bearer " + window.TODOIST_TOKEN;
    const tasks = await fetch(url, {
      headers: {
        Authorization: bearer
      }
    }).then((res) => res.json());
    return tasks.map((task) => task.id);
  };
  const getTodoBlocksReferringToThisPage = async (title) => {
    try {
      return await window.roamAlphaAPI.q(`
        [:find (pull ?refs [:block/string :block/uid {:block/children ...}])
          :where [?refs :block/refs ?title][?refs :block/refs ?todoTitle][?todoTitle :node/title "TODO"][?title :node/title "${title}"]]`);
    } catch (e) {
      console.log("error in getTodoBlocksReferringToThisPage: ", e);
      return [];
    }
  };
  const getTodoBlocksWithTodoistId = async () => {
    const roamTodoBlocks = await getTodoBlocksReferringToThisPage(window.RTI.TODOIST_TAG_NAME);
    return roamTodoBlocks.map((item) => {
      const block = item[0];
      const { string } = block;
      const todoistId = string.match(/\d{10}/)[0];
      return __spreadProps(__spreadValues({}, block), {
        todoistId
      });
    });
  };
  const getCompletedBlockUIds = (activeTodoistIds2, roamTodoist2) => {
    const completedBlocks2 = roamTodoist2.filter(({ todoistId }) => {
      return !activeTodoistIds2.includes(Number(todoistId));
    });
    return completedBlocks2;
  };
  const activeTodoistIds = await getActiveTodoistIds();
  const roamTodoist = await getTodoBlocksWithTodoistId();
  const completedBlocks = getCompletedBlockUIds(activeTodoistIds, roamTodoist);
  for (const block of completedBlocks) {
    const newContent = block.string.replace("{{[[TODO]]}}", "{{[[DONE]]}}");
    await roam42.common.updateBlock(block.uid, newContent);
  }
  return "";
};
export { completeTask, pullTasks, syncCompleted };
