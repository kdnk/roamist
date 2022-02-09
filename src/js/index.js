const ID = "roam-todoist-integration";

const features = [
  "utils/util",
  "pull-tasks",
  "complete-task",
  "sync-completed",
];

features.forEach((feature) => {
  const FEATURE_ID = `${ID}-${feature}`;
  const existing = document.getElementById(FEATURE_ID);
  if (!existing) {
    const script = document.createElement("script");
    script.src = `https://kdnk.github.io/roam-todoist-integration/src/js/${feature}.js`;
    script.id = FEATURE_ID;
    script.type = "text/javascript";
    document.getElementsByTagName("head")[0].appendChild(script);
  }
});