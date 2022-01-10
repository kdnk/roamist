/* vim: set sw=2 sts=2 ts=2 et: */

window.roamTodoistIntegration = {};
window.roamTodoistIntegration.TODOIST_TAG_NAME = "42Todoist";

window.roamTodoistIntegration.settings = {
  projectNames: {
    WORK: '🔨Work',
    PERSONAL: '🦒Personal',
    ROUTINE: '🧘Routine',
    QUICK_CAPTURE: 'Quick Capture',
  }
};


window.roamTodoistIntegration.convertToRoamDate = (dateString) => {
  const parsedDate = dateString.split('-');
  const year = parsedDate[0];
  const month = Number(parsedDate[1]);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthName = months[month - 1];
  const day = Number(parsedDate[2]);
  const suffix = (day >= 4 && day <= 20) || (day >= 24 && day <= 30)
    ? "th"
    : ["st", "nd", "rd"][day % 10 - 1];
  return `${monthName} ${day}${suffix}, ${year}`;
}

window.roamTodoistIntegration.getTodoistId = (url) => {
  try {
    const todoistId = url.match(/\d{10}/)[0];
    return todoistId;
  } catch (e) {
    console.warn(e);
    return '';
  }
}

window.roamTodoistIntegration.createTodoistTaskString = ({ task, project }) => {
  let taskString = `${task.content} [🔗](${task.url})`;

  // priority
  let priority = "";
  if (task.priority == "4") {
    priority = "p1";
  } else if (task.priority == "3") {
    priority = "p2";
  } else if (task.priority == "2") {
    priority = "p3";
  } else if (task.priority == "1") {
    priority = "p4";
  }
  taskString = `#priority/${priority} ${taskString}`;

  // add id
  const taskId = window.roamTodoistIntegration.getTodoistId(task.url);
  if (taskId) {
    taskString = `${taskString} #Todoist/${taskId}`;
  }

  // due date
  if (task.due) {
    taskString = `${taskString} [[${window.roamTodoistIntegration.convertToRoamDate(task.due.date)}]]`;
  }

  // project tag
  taskString = `${taskString} #[[${project.name}]] #${window.roamTodoistIntegration.TODOIST_TAG_NAME}`;

  return `{{[[TODO]]}} ${taskString} `;
}

window.roamTodoistIntegration.getAllTodoistBlocksFromPageTitle = async (pageTitle) => {
  const rule = '[[(ancestor ?b ?a)[?a :block/children ?b]][(ancestor ?b ?a)[?parent :block/children ?b ](ancestor ?parent ?a) ]]';

  const query = `[:find  (pull ?block [:block/uid :block/string])
                                  :in $ ?page_title %
                                  :where
                                  [?page :node/title ?page_title]
                                  [?block :block/string ?contents]
                                  [(clojure.string/includes? ?contents "#${window.roamTodoistIntegration.TODOIST_TAG_NAME}")]
                                  (ancestor ?block ?page)]`;

  const results = await window.roamAlphaAPI.q(query, pageTitle, rule);
  return results;
}

window.roamTodoistIntegration.dedupTaskList = async (taskList) => {
  const currentPageUid = await roam42.common.currentPageUID();
  console.log(`[util.js:79] currentPageUid: `, currentPageUid);
  const currentpageTitle = await roam42.common.getBlockInfoByUID(currentPageUid);
  const existingBlocks = await window.roamTodoistIntegration.getAllTodoistBlocksFromPageTitle(currentpageTitle[0][0].title);
  const existingTodoistIds = existingBlocks.map((item) => {
    const block = item[0];
    todoistId = window.roamTodoistIntegration.getTodoistId(block.string);
    return todoistId;
  });
  const newTaskList = taskList.filter(task => {
    const taskId = window.roamTodoistIntegration.getTodoistId(task.url);
    return !existingTodoistIds.includes(taskId);
  });
  return newTaskList;
}

window.roamTodoistIntegration.getTodoistProjects = async () => {
  const url = `https://api.todoist.com/rest/v1/projects`;
  const bearer = 'Bearer ' + TODOIST_TOKEN;
  const projects = await fetch(url, {
    headers: {
      Authorization: bearer,
    }
  }).then(res => res.json());
  return projects;
}

window.roamTodoistIntegration.getTodoistProject = (projects, projectId) => {
  const project = projects.find(p => {
    return p.id === projectId;
  })
  return project;
}



