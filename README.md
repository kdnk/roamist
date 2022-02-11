<div align="center">
  <h1>Todoist ❤️ Roam Research</h1>
  <h2>🚧 WORK IN PROGRESS 🚧</h2>
  <p>
  This is a work in progress, and breaking changes to the setup/config could occur in the future. 
  If you have any trouble, don't hesitate to create new Issues or contact me on the <a href="https://roamresearch.slack.com/archives/C03318RAN72">#roamist</a> channel on Roam Slack. Sorry for any inconvenience.
  </p>
</div>

https://user-images.githubusercontent.com/15260226/150548599-69e6f82a-15e8-43fc-a761-59c0f515c56f.mp4

## Table of Contents

* [Motivation](#motivation)
* [Prerequires](#prerequires)
* [Setup](#setup)
  * [Load Roamist](#load-roamist)
  * [Configuration](#configuration)
* [Add workflows for SmartBlocks](#add-workflows-for-smartblocks)
* [Workflows](#workflows)
  * [<img width="24px" src="https://user-images.githubusercontent.com/15260226/150349798-b326f4fa-7d66-48ed-bdca-ee6bd1885765.png" /> pull tasks](#<img-width="24px"-src="https://user-images.githubusercontent.com/15260226/150349798-b326f4fa-7d66-48ed-bdca-ee6bd1885765.png"-/>-pull-tasks)
  * [<img width="24px" src="https://user-images.githubusercontent.com/15260226/150349798-b326f4fa-7d66-48ed-bdca-ee6bd1885765.png" /> sync completed](#<img-width="24px"-src="https://user-images.githubusercontent.com/15260226/150349798-b326f4fa-7d66-48ed-bdca-ee6bd1885765.png"-/>-sync-completed)
  * [<img width="24px" src="https://user-images.githubusercontent.com/15260226/150349798-b326f4fa-7d66-48ed-bdca-ee6bd1885765.png" /> complete task](#<img-width="24px"-src="https://user-images.githubusercontent.com/15260226/150349798-b326f4fa-7d66-48ed-bdca-ee6bd1885765.png"-/>-complete-task)
* [`roam/css` for priority](#`roam/css`-for-priority)
* [Inspired](#inspired)

## Motivation

I have been using Todoist as my task management tool for a long time.  
I still think that Roam Research is the best note-taking tool, but Todoist is more suitable for task management.

Since I started using Roam Research, I've wondered if it would be possible to use Todoist for task management but take detailed notes for each task in Roam Research.

This Roamist is one way to make this possible. With this integration, you can copy tasks from Todoist to Roam Research, complete Todoist tasks from within Roam Reasearch, and synchronize task completion status between Todoist and Roam Reserach.

## Prerequires

- Todoist’s api token
  - See: https://developer.todoist.com/rest/v1/#javascript-sdk
  - You can get your token on https://todoist.com/prefs/integrations.
- smartBlocks
  - https://roamjs.com/extensions/smartblocks

## Setup

### Load Roamist

- Create a block with `{{[[roam/js]]}}` and put the code below as a child block.
  - If you're not familiar with `{{[[roam/js]]}}`, see https://roamresearch.com/#/app/help/page/nBCwjGuI7.

```javascript
const ID = "roamist";
const existing = document.getElementById(ID);
if (!existing) {
  const script = document.createElement("script");
  script.src = "https://kdnk.github.io/roamist/dist/roamist.umd.js";
  script.id = ID;
  script.defer = true;
  script.type = "text/javascript";
  document.getElementsByTagName("head")[0].appendChild(script);
}
```

> :warning: **All tasks pulled from Todoist should have a specific tag you set in `[[roam/roamist]]`.**  
> **This tag is essential because this integration uses the tag to recognize which blocks come from Todoist.**  
> **I recommend you don’t change it once you set this tag.**  
> **See also [workflows section](https://github.com/kdnk/roamist/blob/main/README.md#workflows) for more details**.

### Configuration

- Set up `Token` and `Tag` in `[[roam/roamist]]`
  - You should already have `[[roam/roamist]]`, if you follow [Load Roamist](#load-roamist) properly.

<img width="500px" src="https://user-images.githubusercontent.com/15260226/153557453-fd92289b-b418-44dc-8d45-b297ab422f76.png" />

## Add workflows for SmartBlocks

> :warning: **You should already have the page named `roam/js/smartblocks` if you followed `Setup` section.  
> If not, make sure you set up SmartBlocks correctly first.**

- Paste some [workflows](https://github.com/kdnk/roamist#workflows) what you like under workflows block on `[[roam/js/smartblocks]]`.
  - After finishing setup, your `[[roam/js/smartblocks]]` page should look like this.

![screenshot](https://user-images.githubusercontent.com/15260226/150348953-ceb7f670-450f-4673-8b01-0e1eac29fda6.png)

- Then, you can use these [workflows](https://github.com/kdnk/roamist#workflows) typing your SmartBlocks trigger (I use `jj` for it).

![sceenshot](https://user-images.githubusercontent.com/15260226/150341510-a15a0025-2646-43aa-ba03-81fe5af13579.png)

## Workflows

> :warning: **This integration recognizes the Todoist id using a tag like `Todoist/1234567890`.**  
> **You must NOT remove this tag.**  
> **If you do, this integration won't work as intended.**

### <img width="24px" src="https://user-images.githubusercontent.com/15260226/150349798-b326f4fa-7d66-48ed-bdca-ee6bd1885765.png" /> pull tasks

- This workflow will pull tasks with the [Todoist's Filters](https://todoist.com/help/articles/introduction-to-filters).
- Block will look like this.
  - ![image](https://user-images.githubusercontent.com/15260226/150467089-d564ebe3-cded-4bfe-860e-c6e032b93cd2.png)
- This command should work in any pages.
- arguments
  - `todoistFilter`
    - You can pass your filter here.
  - `onlyDiff`
    - If you pass `true`, this workflow pulls only tasks which don't exist in the current page.

````
- #SmartBlock todoist - pull daily today
    - <%JAVASCRIPTASYNC:```javascript
(async function () {
  await window.Roamist.pullTasks({ todoistFilter: "(#🧘Routine & #🦒Personal) & today", onlyDiff: false });
})();
```%>
````

### <img width="24px" src="https://user-images.githubusercontent.com/15260226/150349798-b326f4fa-7d66-48ed-bdca-ee6bd1885765.png" /> sync completed

> :warning: **I assume we use this workflow in `[[42Todoist]]` page or the page you set via `[[roam/roamist]]`.**

- This workflow will sync completion status from Todoist to Roam Research.
- If there are blocks which are already completed in Todoist, `{{[[TODO]]}}` part in Roam Research will be changed to `{{[[DONE]]}}` automatically just pressing this button.
- I recommend you use this workflow as a button in `[[42Todoist]]` as follows.
  - `{{Sync todoist completed:42SmartBlock:todoist - sync completed:button=true,42RemoveButton=false}}`
  - ![CleanShot 2022-01-22 at 00 00 59](https://user-images.githubusercontent.com/15260226/150549391-3d993f6d-2edd-4e8f-bc8b-e7440a4e2236.png)

````
- #SmartBlock todoist - sync completed
    - <%JAVASCRIPTASYNC:```javascript
(async function () {
  await window.Roamist.syncCompleted();
})();
```%><%NOBLOCKOUTPUT%>
````

### <img width="24px" src="https://user-images.githubusercontent.com/15260226/150349798-b326f4fa-7d66-48ed-bdca-ee6bd1885765.png" /> complete task

- This workflow will complete a task under your cursor.
  - After running this workflow, `{{[[TODO]]}}` will turn into `{{[[DONE]]}}` automatically.

````
- #SmartBlock todoist - complete task
    - <%JAVASCRIPTASYNC:```javascript
(async function () {
  await window.Roamist.completeTask();
})();
```%>
````

## `roam/css` for priority

- I recommend you set css for todoist's priority.
  - ref. https://roamresearch.com/#/app/help/page/RA1UXmzp0

````css
- #priority/p1 #priority/p2 #priority/p3 #priority/p4
    - ```css
    @import url('https://kdnk.github.io/roamist/src/css/priority.css');
    ```
````

## Inspired

- [dvargas92495/roam42](https://github.com/dvargas92495/roam42)
- [Universal Quick Capture for Roam Research Beta](https://github.com/dvargas92495/SmartBlocks/issues/187)
