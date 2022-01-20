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

- Create a block with `{{roam/js}}` and put the code below as a child block.
  - If you're not familiar with `{{roam/js}}`, see https://roamresearch.com/#/app/help/page/nBCwjGuI7.

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
> This tag is essential because this integration uses the tag to recognize which tags come from Todoist.
> This integration will use this tag to sync tasks between Roam Research and Todoist as well.
> I recommend you don’t change it once you set this tag.

## Add workflows for SmartBlocks

> :warning: **You should already have the page named `roam/js/smartblocks` if you followed `Setup` section.
> If not, make sure you set up SmartBlocks correctly first.**


- Paste some [workflows](https://github.com/kdnk/roam-todoist-integration#workflows) what you like under workflows block on `[[roam/js/smartblocks]]`.
  - After finishing setup, your `[[roam/js/smartblocks]]` page should look like this.

![screenshot](https://user-images.githubusercontent.com/15260226/150338952-f702b064-8e43-4570-90b0-8f633f6dc9ac.png)

- Then, you can use these [workflows](https://github.com/kdnk/roam-todoist-integration#workflows) typing your SmartBlocks trigger (I use `jj` for it).

![CleanShot 2022-01-20 at 21 47 05](https://user-images.githubusercontent.com/15260226/150341510-a15a0025-2646-43aa-ba03-81fe5af13579.png)


## workflows

> :warning: This integration recognizes the Todoist id using a tag like `Todoist/1234567890`.
> You must NOT remove this tag.
> If you do, this integration won't work as intended.

### complete task
- This workflow will complete a task under your cursor.
  - Roam Research: `{{[[TODO]]}}` will turn into `{{[[DONE]]}}`

```
- #SmartBlock todoist - complete task
    - <%JAVASCRIPTASYNC:```javascript
(async function () {
  await window.RTI.completeTask();
})();
```%>
```

### sync completed
> :warning: I assume we use this workflow in `[[42Todoist]]` page or the page you set via `window.RTI.TODOIST_TAG_NAME`.

- This workflow will sync completion status from Todoist to Roam Research.
- If there are blocks which are already completed in Todoist, `{{[[TODO]]}}` part in Roam Research will be changed to `{{[[DONE]]}}` automatically just pressing this button.
- I recommend you use this workflow as a button in `[[42Todoist]]` as follows.
  - `{{Sync todoist completed:42SmartBlock:todoist - sync completed:button=true,42RemoveButton=false}}`
  - ![screenshot](https://user-images.githubusercontent.com/15260226/150343120-6a0da186-8501-43b4-b488-54a2cca1aff0.png)

```
- #SmartBlock todoist - sync completed
    - <%JAVASCRIPTASYNC:```javascript
(async function () {
  await window.RTI.syncCompleted();
})();
```%><%NOBLOCKOUTPUT%>
```

### pull tasks
- This workflow will pull tasks with the [Todoist's Filters](https://todoist.com/help/articles/introduction-to-filters).
- Block will look like this.
- This command should work in any pages.
- arguments
  - `todoistFilter`
    - You can pass your filter here.
  - `onlyDiff`
    - If you pass `true`, this workflow pulls only tasks which don't exist in the current page.
```
- #SmartBlock todoist - pull daily today
    - <%JAVASCRIPTASYNC:```javascript
(async function () {
  await window.RTI.pullTasks({ todoistFilter: "(!#🔨Work & !#Inbox & !#Quick Capture & !#🧘Routine & !#🦒Personal) & today", onlyDiff: false });
})();
```%>
```






