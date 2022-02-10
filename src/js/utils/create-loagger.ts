/* eslint-disable @typescript-eslint/no-explicit-any */
type FeatureName = "complete-task" | "sync-completed" | "pull-tasks";

export const createLogger = (featureName: FeatureName) => {
  return (log: any) => {
    console.log(`<<<<<<<<< [roamist] ${featureName} >>>>>>>>>: `, log);
  };
};
