# roam-todoist-integration


<!-- vim-markdown-toc GFM -->

* [Motivation](#motivation)
* [Prerequires](#prerequires)
* [Setup](#setup)
* [Add workflows for SmartBlocks](#add-workflows-for-smartblocks)
* [Workflows](#workflows)
  * [<img width="24px" src="https://user-images.githubusercontent.com/15260226/150349798-b326f4fa-7d66-48ed-bdca-ee6bd1885765.png" /> pull tasks](#img-width24px-srchttpsuser-imagesgithubusercontentcom15260226150349798-b326f4fa-7d66-48ed-bdca-ee6bd1885765png--pull-tasks)
  * [<img width="24px" src="https://user-images.githubusercontent.com/15260226/150349798-b326f4fa-7d66-48ed-bdca-ee6bd1885765.png" /> sync completed](#img-width24px-srchttpsuser-imagesgithubusercontentcom15260226150349798-b326f4fa-7d66-48ed-bdca-ee6bd1885765png--sync-completed)
  * [<img width="24px" src="https://user-images.githubusercontent.com/15260226/150349798-b326f4fa-7d66-48ed-bdca-ee6bd1885765.png" /> complete task](#img-width24px-srchttpsuser-imagesgithubusercontentcom15260226150349798-b326f4fa-7d66-48ed-bdca-ee6bd1885765png--complete-task)
* [Recommended `roam/css`](#recommended-roamcss)

<!-- vim-markdown-toc -->

## Motivation

For a long time, I have been using Todoist as my personal task management tool.  
I still think that Roam Research is the best note-taking tool, but I think that Todoist is more suitable for task management.  

Since I started using Roam Research, I've been wondering if it would be possible to use Todoist for task management, but take detailed notes for each task in Roam Research.  

This roam-todoist-integration is one way to make this possible. With this tool, you can copy tasks from Todoist to Roam Research, complete Todoist tasks from within Roam Reasearch, and synchronize task completion status between Todoist and Roam Reserach.  

## Prerequires

- Todoist’s api token
  - See: https://developer.todoist.com/rest/v1/#javascript-sdk
  - You can get your token on https://todoist.com/prefs/integrations.
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

> :warning: **All tasks pulled from Todoist should have a specific tag you set via `window.RTI.TODOIST_TAG_NAME`.**  
> **This tag is essential because this integration uses the tag to recognize which blocks come from Todoist.**  
> **I recommend you don’t change it once you set this tag.**  
> **See also [workflows section](https://github.com/kdnk/roam-todoist-integration/blob/main/README.md#workflows) for more details**.

## Add workflows for SmartBlocks

> :warning: **You should already have the page named `roam/js/smartblocks` if you followed `Setup` section.  
> If not, make sure you set up SmartBlocks correctly first.**  


- Paste some [workflows](https://github.com/kdnk/roam-todoist-integration#workflows) what you like under workflows block on `[[roam/js/smartblocks]]`.
  - After finishing setup, your `[[roam/js/smartblocks]]` page should look like this.

![screenshot](https://user-images.githubusercontent.com/15260226/150348953-ceb7f670-450f-4673-8b01-0e1eac29fda6.png)

- Then, you can use these [workflows](https://github.com/kdnk/roam-todoist-integration#workflows) typing your SmartBlocks trigger (I use `jj` for it).


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
- ```
- #SmartBlock todoist - pull daily today
    - <%JAVASCRIPTASYNC:```javascript
(async function () {
  await window.RTI.pullTasks({ todoistFilter: "(!#🔨Work & !#Inbox & !#Quick Capture & !#🧘Routine & !#🦒Personal) & today", onlyDiff: false });
})();
```%>
```



### <img width="24px" src="https://user-images.githubusercontent.com/15260226/150349798-b326f4fa-7d66-48ed-bdca-ee6bd1885765.png" /> sync completed


> :warning: **I assume we use this workflow in `[[42Todoist]]` page or the page you set via `window.RTI.TODOIST_TAG_NAME`.**a  

- This workflow will sync completion status from Todoist to Roam Research.
- If there are blocks which are already completed in Todoist, `{{[[TODO]]}}` part in Roam Research will be changed to `{{[[DONE]]}}` automatically just pressing this button.
- I recommend you use this workflow as a button in `[[42Todoist]]` as follows.
  - `{{Sync todoist completed:42SmartBlock:todoist - sync completed:button=true,42RemoveButton=false}}`
  - ![screenshot](https://user-images.githubusercontent.com/15260226/150343120-6a0da186-8501-43b4-b488-54a2cca1aff0.png)
- ```
- #SmartBlock todoist - sync completed
    - <%JAVASCRIPTASYNC:```javascript
(async function () {
  await window.RTI.syncCompleted();
})();
```%><%NOBLOCKOUTPUT%>
```


### <img width="24px" src="https://user-images.githubusercontent.com/15260226/150349798-b326f4fa-7d66-48ed-bdca-ee6bd1885765.png" /> complete task

- This workflow will complete a task under your cursor.
  - After running this workflow, `{{[[TODO]]}}` will turn into `{{[[DONE]]}}` automatically.
- ```
- #SmartBlock todoist - complete task
    - <%JAVASCRIPTASYNC:```javascript
(async function () {
  await window.RTI.completeTask();
})();
```%>
```



## Recommended `roam/css`

- I recommend you set css for todoist's priority.
  - ref. https://roamresearch.com/#/app/help/page/RA1UXmzp0

```css
- #priority/p1 #priority/p2 #priority/p3 #priority/p4
    - ```css
span.rm-page-ref[data-tag^="priority"]
{
  padding: 3px 5px 3px 5px;
  display:inline-block;
}

span.rm-page-ref[data-tag$="/p1"]::before {
  content: '🔴 ';
}
span.rm-page-ref[data-tag$="/p1"] {
  background-color: rgb(252,231,235);
}

span.rm-page-ref[data-tag$="/p2"]::before {
  content: '🟠 ';
}
span.rm-page-ref[data-tag$="/p2"] {
  background-color: rgb(250,224,175);
}

span.rm-page-ref[data-tag$="/p3"]::before {
  content: '🔵 ';
}
span.rm-page-ref[data-tag$="/p3"] {
  background-color: rgb(199,230,240);
}

span.rm-page-ref[data-tag$="/p4"]::before {
  content: '⚪️ ';
}
span.rm-page-ref[data-tag$="/p4"] {
  background-color: rgb(244,244,244);
}```
```





