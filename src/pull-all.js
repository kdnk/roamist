/* vim: set sw=2 sts=2 ts=2 et: */

// (async function () {
//   await window.roamTodoistIntegration.pullAll();
// })();

window.roamTodoistIntegration.pullAll = async ({ onlyDiff }) => {
  const TODOIST_TOKEN = window.TODOIST_TOKEN;
  const PROJECT_ID = window.TODOIST_WORK_PROJECT_ID ;
  const FILTER = encodeURIComponent('(!#🔨Work & !#Inbox & !#Quick Capture & !#♻Routine & !#🧬Personal) & 2days');

  const getTodoistProject = (projects, projectId) => {
    const project = projects.find(p => {
      return p.id === projectId;
    })
    return project;
  }

  const getTodoistTasks = async () => {
    const url = `https://api.todoist.com/rest/v1/tasks?filter=${FILTER}`;
    const bearer = 'Bearer ' + TODOIST_TOKEN;
    const tasks = await fetch(url, {
      headers: {
        Authorization: bearer,
      }
    }).then(res => res.json());
    return tasks;
  }

  const projects = await window.roamTodoistIntegration.getTodoistProjects();
  const tasks = await getTodoistTasks();
  let taskList = tasks.filter(task => !task.parent_id);
  if (onlyDiff) {
    taskList = await window.roamTodoistIntegration.dedupTaskList(taskList);
  }
  taskList.sort((a, b) => {
    return b.priority - a.priority;
  });
  const subTaskList = tasks.filter(task => task.parent_id);

  const cursorBlockUid = roam42.common.currentActiveBlockUID();
  let currentBlockUid = cursorBlockUid;
  for ([taskIndex, task] of taskList.entries()) {
    const project = window.roamTodoistIntegration.getTodoistProject(projects, task.project_id);
    currentBlockUid = await roam42.common.createSiblingBlock(currentBlockUid, window.roamTodoistIntegration.createTodoistTaskString({ task, project }), true);

    // add description
    if (task.description){
      await roam42.common.createBlock(currentBlockUid, 1, `desc:: ${task.description}`);
    }

    // add subtask
    const subtasks = subTaskList.filter(subtask => subtask.parent_id === task.id);
    let currentSubBlockUid;
    for ([subtaskIndex, subtask] of subtasks.entries()) {
      if (subtaskIndex === 0) {
        currentSubBlockUid = await roam42.common.createBlock(currentBlockUid, 1, window.roamTodoistIntegration.createTodoistTaskString({ task: subtask, project }));
      } else {
        currentSubBlockUid = await roam42.common.createSiblingBlock(currentSubBlockUid, window.roamTodoistIntegration.createTodoistTaskString({ task: subtask, project }), true);
      }

      // add description
      if (subtask.description) {
        await roam42.common.createBlock(currentSubBlockUid, 2, `desc:: ${subtask.description}`);
      }
    }
    if (taskIndex === 0) {
      await roam42.common.deleteBlock(cursorBlockUid);
    }
  }

  return '';
};

