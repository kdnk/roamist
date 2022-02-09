import { completeTask } from "./complete-task";
import { pullTasks } from "./pull-tasks";
import { syncCompleted } from "./sync-completed";

window.RTI = {
  ...window.RTI,
  completeTask,
  pullTasks,
  syncCompleted,
};

console.log("[index.ts:12] window.RTI: ", window.RTI);
