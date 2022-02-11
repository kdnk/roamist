import { Project, Task, TodoistApi } from "@doist/todoist-api-typescript";
import { createBlock, getActiveUids } from "roamjs-components";
import { createLogger } from "../../utils/create-loagger";
import { createTodoistTaskString } from "../../utils/create-todoist-task-string";
import { createDescriptionBlock } from "./create-description-block";
import { dedupTaskList } from "./dedup-tasks";

const api = new TodoistApi(window.TODOIST_TOKEN);
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
    projects = await api.getProjects()
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

    const { parentUid } = getActiveUids();
    for (const [taskIndex, task] of taskList.entries()) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const project = projects.find((p: any) => {
        return p.id === task.projectId;
      });

      if (!project) {
        return;
      }

      const taskBlockUid = await createBlock({
        parentUid,
        order: taskIndex,
        node: { text: createTodoistTaskString({ task, project }) },
      });

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
