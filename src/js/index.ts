import { completeTask } from "./complete-task";
import { pullTasks } from "./pull-tasks";
import { syncCompleted } from "./sync-completed";

window.Roamist = {
  ...window.Roamist,
  completeTask,
  pullTasks,
  syncCompleted,
};

console.log("<<< roamist >>> window.Roamist: ", window.Roamist);
console.log("<<< roamist >>> setup compoleted.");
