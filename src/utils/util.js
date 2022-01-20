/* vim: set sw=2 sts=2 ts=2 et: */

window.RTI = {};
window.RTI.TODOIST_TAG_NAME = window.RTI.TODOIST_TAG_NAME || "42Todoist";

// ref. https://github.com/dvargas92495/SmartBlocks/issues/187#issuecomment-766252353
window.RTI.convertToRoamDate = (dateString) => {
  const [year, month, day] = dateString.split("-").map((v) => Number(v));
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthName = months[month - 1];
  const suffix =
    (day >= 4 && day <= 20) || (day >= 24 && day <= 30)
      ? "th"
      : ["st", "nd", "rd"][(day % 10) - 1];
  return `${monthName} ${day}${suffix}, ${year}`;
};

window.RTI.getTodoistId = (url) => {
  try {
    const todoistId = url.match(/\d{10}/)[0];
    return todoistId;
  } catch (e) {
    console.warn(e);
    return "";
  }
};

window.RTI.createTodoistTaskString = ({ task, project }) => {
  function getParsedContent(content) {
    const matchedLink = content.match(/\[(.*)\]\((.*)\)/);
    if (!matchedLink) {
      return content;
    } else {
      // isUrl
      const [matchedString, title, urlString] = matchedLink;
      const getDiff = (diffMe, diffBy) => diffMe.split(diffBy).join("");
      const diff = getDiff(content, matchedString);

      const url = new URL(urlString);
      const matchedTags = [...title.matchAll(/\[(.[^\]\[]*)\]/g)];
      if (matchedTags.length > 0) {
        // have [] pattens
        let newTitle = title;
        let tagString = "";
        matchedTags.forEach(([origin, content]) => {
          newTitle = newTitle.replace(origin, "");
          tagString = `${tagString} #[[${content}]]`;
        });
        if (!urlString.includes("bts")) {
          return `${diff}[${newTitle}](${urlString}) ${tagString}`;
        }
        return `${diff}[${newTitle}](${url.origin}${url.pathname}) ${tagString}`;
      } else {
        if (!urlString.includes("bts")) {
          return `${diff}[${title}](${urlString})`;
        }
        return `${diff}[${title}](${url.origin}${url.pathname})`;
      }
    }
  }

  let taskString = `${getParsedContent(task.content)} [🔗](${task.url})`;

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
  const taskId = window.RTI.getTodoistId(task.url);
  if (taskId) {
    taskString = `${taskString} #Todoist/${taskId}`;
  }

  // due date
  if (task.due) {
    taskString = `${taskString} [[${window.RTI.convertToRoamDate(
      task.due.date
    )}]]`;
  }

  // project tag
  taskString = `${taskString} #[[${project.name}]] #${window.RTI.TODOIST_TAG_NAME}`;

  return `{{[[TODO]]}} ${taskString} `;
};

window.RTI.getAllTodoistBlocksFromPageTitle = async (pageTitle) => {
  const rule =
    "[[(ancestor ?b ?a)[?a :block/children ?b]][(ancestor ?b ?a)[?parent :block/children ?b ](ancestor ?parent ?a) ]]";

  const query = `[:find  (pull ?block [:block/uid :block/string])
                                  :in $ ?page_title %
                                  :where
                                  [?page :node/title ?page_title]
                                  [?block :block/string ?contents]
                                  [(clojure.string/includes? ?contents "#${window.RTI.TODOIST_TAG_NAME}")]
                                  (ancestor ?block ?page)]`;

  const results = await window.roamAlphaAPI.q(query, pageTitle, rule);
  return results;
};

window.RTI.dedupTaskList = async (taskList) => {
  const currentPageUid = await roam42.common.currentPageUID();
  console.log(`[util.js:79] currentPageUid: `, currentPageUid);
  const currentpageTitle = await roam42.common.getBlockInfoByUID(
    currentPageUid
  );
  const existingBlocks = await window.RTI.getAllTodoistBlocksFromPageTitle(
    currentpageTitle[0][0].title
  );
  const existingTodoistIds = existingBlocks.map((item) => {
    const block = item[0];
    todoistId = window.RTI.getTodoistId(block.string);
    return todoistId;
  });
  const newTaskList = taskList.filter((task) => {
    const taskId = window.RTI.getTodoistId(task.url);
    return !existingTodoistIds.includes(taskId);
  });
  return newTaskList;
};

window.RTI.getTodoistProjects = async () => {
  const url = `https://api.todoist.com/rest/v1/projects`;
  const bearer = "Bearer " + TODOIST_TOKEN;
  const projects = await fetch(url, {
    headers: {
      Authorization: bearer,
    },
  }).then((res) => res.json());
  return projects;
};

window.RTI.getTodoistProject = (projects, projectId) => {
  const project = projects.find((p) => {
    return p.id === projectId;
  });
  return project;
};
