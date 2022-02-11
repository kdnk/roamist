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

## Workflows

> :warning: **This integration recognizes the Todoist id using a tag like `Todoist/1234567890`.**  
> **You must NOT remove this tag.**  
> **If you do, this integration won't work as intended.**

### <img width="24px" src="https://user-images.githubusercontent.com/15260226/150349798-b326f4fa-7d66-48ed-bdca-ee6bd1885765.png" /> pull tasks

- This workflow will pull tasks with the [Todoist's Filters](https://todoist.com/help/articles/introduction-to-filters).
  - You can set your filter in `[[roam/roamist]]`
    - ![CleanShot 2022-02-12 at 02 46 41](https://user-images.githubusercontent.com/15260226/153642825-b1afc320-2204-4783-ba60-a52fa64115a5.png)
- Block will look like this.
  - ![image](https://user-images.githubusercontent.com/15260226/150467089-d564ebe3-cded-4bfe-860e-c6e032b93cd2.png)
- This command should work in any pages.
- arguments
  - `todoistFilter`
    - You can pass your filter here.
  - `onlyDiff`
    - If you pass `true`, this workflow pulls only tasks which don't exist in the current page.

### <img width="24px" src="https://user-images.githubusercontent.com/15260226/150349798-b326f4fa-7d66-48ed-bdca-ee6bd1885765.png" /> sync completed

> :warning: **I assume we use this workflow in `[[Roamist]]` page or the page you set via `[[roam/roamist]]`.**

- This workflow will sync completion status from Todoist to Roam Research.
- I recommend you use this workflow as a button in `[[Roamist]]` as follows.
  - `{{Sync todoist completed:42SmartBlock:Roamist - sync completed:button=true,42RemoveButton=false}}`
  - ![CleanShot 2022-01-22 at 00 00 59](https://user-images.githubusercontent.com/15260226/150549391-3d993f6d-2edd-4e8f-bc8b-e7440a4e2236.png)
- If there are blocks which are already completed in Todoist, `{{[[TODO]]}}` part in Roam Research will be changed to `{{[[DONE]]}}` automatically just pressing this button.

### <img width="24px" src="https://user-images.githubusercontent.com/15260226/150349798-b326f4fa-7d66-48ed-bdca-ee6bd1885765.png" /> complete task

- This workflow will complete a task under your cursor.
  - After running this workflow, `{{[[TODO]]}}` will turn into `{{[[DONE]]}}` automatically.

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
