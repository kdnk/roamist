/* vim: set sw=2 sts=2 ts=2 et: */

window.TODOIST_TAG_NAME = "42Todoist";

window.convertToRoamDate = (dateString) => {
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

window.getTodoistId = (url) => {
  try {
    const todoistId = url.match(/\d{10}/)[0];
    return todoistId;
  } catch (e) {
    console.warn(e);
    return '';
  }
}

window.createTodoistTaskString = ({ task, project }) => {
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
  const taskId = window.getTodoistId(task.url);
  if (taskId) {
    taskString = `${taskString} #Todoist/${taskId}`;
  }

  // due date
  if (task.due) {
    taskString = `${taskString} [[${window.convertToRoamDate(task.due.date)}]]`;
  }

  // project tag
  taskString = `${taskString} #[[${project.name}]] #${TODOIST_TAG_NAME}`;

  return `{{[[TODO]]}} ${taskString} `;
}

