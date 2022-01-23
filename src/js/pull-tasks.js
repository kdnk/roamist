/* vim: set sw=2 sts=2 ts=2 et: */

window.RTI.pullTasks = async ({ todoistFilter, onlyDiff }) => {
  const FILTER = encodeURIComponent(todoistFilter);

  const getTodoistTasks = async () => {
    const url = `https://api.todoist.com/rest/v1/tasks?filter=${FILTER}`;
    const bearer = "Bearer " + window.TODOIST_TOKEN;
    const tasks = await fetch(url, {
      headers: {
        Authorization: bearer,
      },
    }).then((res) => res.json());
    return tasks;
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
  for ([taskIndex, task] of taskList.entries()) {
    const project = window.RTI.getTodoistProject(projects, task.project_id);
    currentBlockUid = await roam42.common.createSiblingBlock(
      currentBlockUid,
      window.RTI.createTodoistTaskString({ task, project }),
      true
    );

    // add description
    if (task.description) {
      await roam42.common.createBlock(
        currentBlockUid,
        1,
        `desc:: ${task.description}`
      );
    }

    // add subtask
    const subtasks = subTaskList.filter(
      (subtask) => subtask.parent_id === task.id
    );
    let currentSubBlockUid;
    for ([subtaskIndex, subtask] of subtasks.entries()) {
      if (subtaskIndex === 0) {
        currentSubBlockUid = await roam42.common.createBlock(
          currentBlockUid,
          1,
          window.RTI.createTodoistTaskString({
            task: subtask,
            project,
          })
        );
      } else {
        currentSubBlockUid = await roam42.common.createSiblingBlock(
          currentSubBlockUid,
          window.RTI.createTodoistTaskString({
            task: subtask,
            project,
          }),
          true
        );
      }

      // add description
      if (subtask.description) {
        const descParentUid = await roam42.common.createBlock(
          currentSubBlockUid,
          2,
          `desc::`
        );
        let descBlockUid;
        subtask.description.split(/\r?\n/).forEach(async (text, index) => {
          if (index === 0) {
            descBlockUid = await roam42.common.createBlock(
              descParentUid,
              3,
              text
            );
          } else {
            descBlockUid = await roam42.common.createSiblingBlock(
              descParentUid,
              text
            );
          }
        });
      }
    }
    if (taskIndex === 0) {
      await roam42.common.deleteBlock(cursorBlockUid);
    }
  }

  return "";
};
