const ID = "roam-todoist-integration";

// const existing = document.getElementById(ID);
// if (!existing) {
//   const script = document.createElement("script");
//   script.src = "https://kdnk.github.io/roam-todoist-integration/src/index.js";
//   script.id = ID;
//   script.async = true;
//   script.type = "text/javascript";
//   document.getElementsByTagName("head")[0].appendChild(script);
// }

const features = [
  "utils/util",
  "pull-work",
  "pull-all",
  "complete-task",
  "sync-completed",
];

features.forEach((feature) => {
  const FEATURE_ID = `${ID}-${feature}`;
  const existing = document.getElementById(FEATURE_ID);
  if (!existing) {
    const script = document.createElement("script");
    script.src = `https://kdnk.github.io/roam-todoist-integration/src/${feature}.js`;
    script.id = `${ID}-${feature}`;
    script.async = true;
    script.type = "text/javascript";
    document.getElementsByTagName("head")[0].appendChild(script);
  }
});
