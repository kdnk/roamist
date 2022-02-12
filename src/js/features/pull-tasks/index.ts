import { Project, Task, TodoistApi } from "@doist/todoist-api-typescript";
import { createBlock, deleteBlock, getActiveUids } from "roamjs-components";

import { createDescriptionBlock } from "../../utils/create-description-block";
import { createLogger } from "../../utils/create-loagger";
import { createTodoistTaskString } from "../../utils/create-todoist-task-string";
import { createSiblingBlock } from "../../utils/createSiblingBlock";
import { getRoamistSetting } from "../../utils/get-roamist-setting";

import { dedupTaskList } from "./dedup-tasks";

const token = getRoamistSetting("token");
const api = new TodoistApi(token);

const logger = createLogger("pull-tasks");
let projects: Project[] | undefined = undefined;

api.getProjects().then((res) => {
  projects = res;
});

export const pullTasks = async ({
  todoistFilter,
  onlyDiff,
}: {
  todoistFilter: string;
  onlyDiff: boolean;
}) => {
  if (projects === undefined) {
    projects = await api.getProjects();
  }
  try {
    const tasks = await api.getTasks({ filter: todoistFilter });
    let taskList = tasks.filter((task: Task) => !task.parentId);
    if (onlyDiff) {
      taskList = await dedupTaskList(taskList);
    }
    taskList.sort((a: Task, b: Task) => {
      return b.priority - a.priority;
    });
    const subTaskList = tasks.filter((task: Task) => task.parentId);

    const { blockUid } = getActiveUids();
    let taskBlockUid: string = blockUid;
    for (const [taskIndex, task] of taskList.entries()) {
      const project = projects.find((p) => {
        return p.id === task.projectId;
      });

      if (!project) {
        return;
      }

      taskBlockUid = await createSiblingBlock({
        fromUid: taskBlockUid,
        text: createTodoistTaskString({ task, project }),
      });
      if (taskIndex === 0) {
        await deleteBlock(blockUid);
      }

      // add description
      if (task.description) {
        await createDescriptionBlock({
          description: task.description,
          taskBlockUid,
        });
      }

      // add subtask
      const subtasks = subTaskList.filter(
        (subtask: Task) => subtask.parentId === task.id
      );
      for (const [subtaskIndex, subtask] of subtasks.entries()) {
        const subTaskBlockUid = await createBlock({
          parentUid: taskBlockUid,
          order: subtaskIndex + (task.description ? 1 : 0),
          node: {
            text: createTodoistTaskString({
              task: subtask,
              project,
            }),
          },
        });

        // add description
        if (subtask.description) {
          await createDescriptionBlock({
            description: subtask.description,
            taskBlockUid: subTaskBlockUid,
          });
        }
      }
    }

    logger("succeeded.");
  } catch (e) {
    logger("failed.");
    logger(e);
  }
};
