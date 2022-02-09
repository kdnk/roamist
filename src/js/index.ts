import { completeTask } from "./complete-task";
import { pullTasks } from "./pull-tasks";
import { syncCompleted } from "./sync-completed";

window.RTI = {
  ...window.RTI,
  completeTask,
  pullTasks,
  syncCompleted,
};

console.log("<<< roamist >>> window.RTI: ", window.RTI);
console.log("<<< roamist >>> setup compoleted.");
