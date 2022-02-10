/* eslint-disable @typescript-eslint/no-explicit-any */
import { TodoistApi } from "@doist/todoist-api-typescript";
import { createTodoistTaskString } from "../../utils/create-todoist-task-string";
import { getAllTodoistBlocksFromPageTitle } from "../../utils/get-all-todoist-blocks-from-page-title";
import { getTodoistId } from "../../utils/get-todoist-id-from-url";

const api = new TodoistApi(window.TODOIST_TOKEN);

export const pullTasks = async ({
  todoistFilter,
  onlyDiff,
}: {
  todoistFilter: string;
  onlyDiff: boolean;
}) => {
  const projects = await api.getProjects();
  const tasks = await api.getTasks({ filter: todoistFilter });
  let taskList = tasks.filter((task: any) => !task.parent_id);
  if (onlyDiff) {
    taskList = await dedupTaskList(taskList);
  }
  taskList.sort((a: any, b: any) => {
    return b.priority - a.priority;
  });
  const subTaskList = tasks.filter((task: any) => task.parent_id);

  const cursorBlockUid = roam42.common.currentActiveBlockUID();
  let currentBlockUid = cursorBlockUid;
  for (const [taskIndex, task] of taskList.entries()) {
    const project = projects.find((p: any) => {
      return p.id === task.projectId;
    });
    currentBlockUid = await roam42.common.createSiblingBlock(
      currentBlockUid,
      createTodoistTaskString({ task, project }),
      true
    );

    // add description
    if (task.description) {
      await createDescriptionBlock({
        description: task.description,
        currentBlockUid: currentBlockUid,
        currentIndent: 1,
      });
    }

    // add subtask
    const subtasks = subTaskList.filter(
      (subtask: any) => subtask.parent_id === task.id
    );
    let currentSubBlockUid;
    for (const [subtaskIndex, subtask] of subtasks.entries()) {
      if (subtaskIndex === 0) {
        currentSubBlockUid = await roam42.common.createBlock(
          currentBlockUid,
          1,
          createTodoistTaskString({
            task: subtask,
            project,
          })
        );
      } else {
        currentSubBlockUid = await roam42.common.createSiblingBlock(
          currentSubBlockUid,
          createTodoistTaskString({
            task: subtask,
            project,
          }),
          true
        );
      }

      // add description
      if (subtask.description) {
        await createDescriptionBlock({
          description: subtask.description,
          currentBlockUid: currentSubBlockUid,
          currentIndent: 2,
        });
      }
    }
    if (taskIndex === 0) {
      await roam42.common.deleteBlock(cursorBlockUid);
    }
  }
};

async function createDescriptionBlock({
  description,
  currentBlockUid,
  currentIndent,
}: {
  description: string;
  currentBlockUid: any;
  currentIndent: number;
}) {
  const descParentUid = await roam42.common.createBlock(
    currentBlockUid,
    currentIndent + 1,
    `desc::`
  );
  let descBlockUid;
  const descList = description.split(/\r?\n/);
  for (const [descIndex, desc] of descList.entries()) {
    if (descIndex === 0) {
      descBlockUid = await roam42.common.createBlock(
        descParentUid,
        currentIndent + 2,
        desc
      );
    } else {
      descBlockUid = await roam42.common.createSiblingBlock(descBlockUid, desc);
    }
  }
}

async function dedupTaskList(taskList: any) {
  const currentPageUid = await roam42.common.currentPageUID();
  console.log(`[util.js:79] currentPageUid: `, currentPageUid);
  const currentpageTitle = await roam42.common.getBlockInfoByUID(
    currentPageUid
  );
  const existingBlocks = await getAllTodoistBlocksFromPageTitle(
    currentpageTitle[0][0].title
  );
  const existingTodoistIds = existingBlocks.map((item: any) => {
    const block = item[0];
    const todoistId = getTodoistId(block.string);
    return todoistId;
  });
  const newTaskList = taskList.filter((task: any) => {
    const taskId = getTodoistId(task.url);
    return !existingTodoistIds.includes(taskId);
  });
  return newTaskList;
}
