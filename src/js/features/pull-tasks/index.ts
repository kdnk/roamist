/* eslint-disable @typescript-eslint/no-explicit-any */
import { Project, TodoistApi } from "@doist/todoist-api-typescript";
import { createBlock, deleteBlock, getActiveUids } from "roamjs-components";
import { createLogger } from "../../utils/create-loagger";
import { createTodoistTaskString } from "../../utils/create-todoist-task-string";
import { createDescriptionBlock } from "./create-description-block";
import { dedupTaskList } from "./dedup-tasks";

const api = new TodoistApi(window.TODOIST_TOKEN);
const logger = createLogger("pull-tasks");

export const pullTasks = async ({
  todoistFilter,
  onlyDiff,
}: {
  todoistFilter: string;
  onlyDiff: boolean;
}) => {
  const projects: Project[] = await api.getProjects();
  const tasks = await api.getTasks({ filter: todoistFilter });
  let taskList = tasks.filter((task: any) => !task.parent_id);
  if (onlyDiff) {
    taskList = await dedupTaskList(taskList);
  }
  taskList.sort((a: any, b: any) => {
    return b.priority - a.priority;
  });
  const subTaskList = tasks.filter((task: any) => task.parent_id);

  try {
    const { blockUid: cursorBlockUid, parentUid } = getActiveUids();
    for (const [taskIndex, task] of taskList.entries()) {
      const project = projects.find((p: any) => {
        return p.id === task.projectId;
      });

      if (!project) {
        return;
      }

      const mainTaskBlockUid = await createBlock({
        parentUid,
        node: { text: createTodoistTaskString({ task, project }) },
        order: taskIndex,
      });

      // add description
      if (task.description) {
        await createDescriptionBlock({
          description: task.description,
          taskBlockUid: mainTaskBlockUid,
        });
      }

      // add subtask
      const subtasks = subTaskList.filter(
        (subtask: any) => subtask.parent_id === task.id
      );
      for (const [subtaskIndex, subtask] of subtasks.entries()) {
        const subTaskBlockUid = await createBlock({
          parentUid: mainTaskBlockUid,
          node: {
            text: createTodoistTaskString({
              task: subtask,
              project,
            }),
          },
          order: subtaskIndex + (task.description ? 1 : 0),
        });

        // add description
        if (subtask.description) {
          await createDescriptionBlock({
            description: subtask.description,
            taskBlockUid: subTaskBlockUid,
          });
        }
      }
      if (taskIndex === 0) {
        deleteBlock(cursorBlockUid);
      }
    }

    logger("succeeded.");
  } catch (e) {
    logger("failed.");
    logger(e);
  }
};
