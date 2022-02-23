type FeatureName =
  | "complete-task"
  | "sync-completed"
  | "pull-tasks"
  | "quick-capture"
  | "get-todoist-id-from-block";

export const createLogger = (featureName: FeatureName) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (log: any) => {
    console.log(`<<<<<<<<< [roamist] ${featureName} >>>>>>>>>: `, log);
  };
};
