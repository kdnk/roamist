import { completeTask } from "./complete-task";
import { pullTasks } from "./pull-tasks";
import { syncCompleted } from "./sync-completed";

window.RTI = {
  completeTask,
  pullTasks,
  syncCompleted,
};

export { completeTask, pullTasks, syncCompleted };
