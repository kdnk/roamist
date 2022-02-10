/* eslint-disable @typescript-eslint/no-explicit-any */
import { TodoistApi } from "@doist/todoist-api-typescript";
import { createTodoistTaskString } from "../../utils/create-todoist-task-string";
import { createDescriptionBlock } from "./create-description-block";
import { dedupTaskList } from "./dedup-tasks";

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
