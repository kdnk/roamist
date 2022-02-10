import { completeTask } from "./features/complete-task";
import { pullTasks } from "./features/pull-tasks";
import { syncCompleted } from "./features/sync-completed";

window.Roamist = window.Roamist || {};
window.Roamist.TODOIST_TAG_NAME = window.Roamist.TODOIST_TAG_NAME || "Roamist";

window.Roamist = {
  ...window.RTI,
  ...window.Roamist,
  completeTask,
  pullTasks,
  syncCompleted,
};

window.RTI = {
  completeTask,
  pullTasks,
  syncCompleted,
};

console.log("<<< roamist >>> window.Roamist: ", window.Roamist);
console.log("<<< roamist >>> setup compoleted.");
