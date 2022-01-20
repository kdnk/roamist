# roam-todoist-integration

## Prerequires

- Todoist’s api token
  - See: https://developer.todoist.com/rest/v1/#javascript-sdk
  - You can get your token from https://todoist.com/prefs/integrations.
- roam42
  - https://roamjs.com/extensions/roam42
- smartBlocks
  - https://roamjs.com/extensions/smartblocks

## Setup

- Create a block with {{roam/js}} and put the code below as a child block.

```javascript
window.TODOIST_TOKEN = "put your todoist token"; // Please replace with your token
window.RTI = {};
window.RTI.TODOIST_TAG_NAME = "42Todoist"; // Please replace here with any tags what you want to use for this integration.
const ID = "roam-todoist-integration";
const existing = document.getElementById(ID);
if (!existing) {
  const script = document.createElement("script");
  script.src = "https://kdnk.github.io/roam-todoist-integration/src/index.js";
  script.id = ID;
  script.async = true;
  script.type = "text/javascript";
  document.getElementsByTagName("head")[0].appendChild(script);
}
```

> :warning: All tasks pulled from Todoist should have a specific tag you set via `window.RTI.TODOIST_TAG_NAME`.
This tag is essential because this integration uses the tag to recognize which tags come from Todoist.
This integration will use this tag to sync tasks between Roam Research and Todoist as well.
I recommend you don’t change it once you set this tag.

## Add workflows for SmartBlocks

> :warning: **You should already have the page named `roam/js/smartblocks` if you followed `Setup` section. If not, make sure you set up SmartBlocks correctly first.**


- Paste some workflows what you like under workflows block on [[roam/js/smartblocks]].

![screenshot](https://user-images.githubusercontent.com/15260226/150338952-f702b064-8e43-4570-90b0-8f633f6dc9ac.png)



### workflows


- complete task
```
- #SmartBlock todoist - complete task
    - <%JAVASCRIPTASYNC:```javascript
(async function () {
  await window.RTI.completeTask();
})();
```%>
```

- sync completed
```
- #SmartBlock todoist - sync completed
    - <%JAVASCRIPTASYNC:```javascript
(async function () {
  await window.RTI.syncCompleted();
})();
```%><%NOBLOCKOUTPUT%>
```

- pull tasks
```
- #SmartBlock todoist - pull daily today
    - <%JAVASCRIPTASYNC:```javascript
(async function () {
  await window.RTI.pullAll({ todoistFilter: "(!#🔨Work & !#Inbox & !#Quick Capture & !#🧘Routine & !#🦒Personal) & today", onlyDiff: false });
})();
```%>
```






