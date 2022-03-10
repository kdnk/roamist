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

* [Table of Contents](#table-of-contents)
* [Motivation](#motivation)
* [Prerequires](#prerequires)
* [Setup](#setup)
  * [Load Roamist](#load-roamist)
  * [Configuration](#configuration)
* [Workflows](#workflows)
  * [pull-tasks](#pull-tasks)
  * [sync-completed](#sync-completed)
  * [complete-task](#complete-task)
* [`roam/css` for priority](#`roam/css`-for-priority)
  * [quick-capture](#quick-capture)
* [Inspired](#inspired)

## Motivation

I have been using Todoist as my task management tool for a long time.  
I still think that Roam Research is the best note-taking tool, but Todoist is more suitable for task management.

Since I started using Roam Research, I've wondered if it would be possible to use Todoist for task management but take detailed notes for each task in Roam Research.

Roamist is one way to make this possible. With this integration, you can copy tasks from Todoist to Roam Research, complete Todoist tasks from within Roam Reasearch, and synchronize task completion status between Todoist and Roam Reserach.

## Prerequires

- Todoist’s api token
  - See: https://developer.todoist.com/rest/v1/#javascript-sdk
  - You can get your token on https://todoist.com/prefs/integrations.
- smartBlocks
  - https://roamjs.com/extensions/smartblocks

## Setup

### 1. Load Roamist

- Create a block with `{roam/js]}}` and place the following code as a child block.
  - If you are not familiar with `{{[[roam/js]]}}`, please refer to https://roamresearch.com/#/app/help/page/nBCwjGuI7.

```javascript
const ID = "roamist";
const existing = document.getElementById(ID);
if (!existing) {
  const script = document.createElement("script");
  script.src = "https://kdnk.github.io/roamist/roamist.umd.js";
  script.id = ID;
  script.defer = true;
  script.type = "text/javascript";
  document.getElementsByTagName("head")[0].appendChild(script);
}
```

### 2. Reload and nagivate to [[roamm/roamist]].

- Reloading automatically creates [[roam/roamist]].

### 3. Set up a Todoist filter on the `[[roam/roamist]]` page.

On the `Pull Tasks` tab in `[[roam/roamist]]`, you can set the Todoist filters you want to use.  
Roamist will import tasks from Todoist based on these filters.  

Follow the format below.  

```
- filters
  - Any name you like to give it
    - filter query of Todoist
```

The first layer should literally be `filters`.  
The second layer is a name of the filter. Use whatever you like.  
The third layer is a query of Todoist filter. If you are not familiar with it, please refer to https://todoist.com/help/articles/introduction-to-filters.  

Once you have set up your filters, reload again.   
Some smartblocks will be automatically added to the block called `workflows` in `[[roam/roamist]]`.  

For example, if you reload with the following settings, you can use the smartblocks `Roamist - pull today` and `Roamist - pull today (only diff)`.  

```
- filters
  - today
    - today
```

`Roamist - pull today (only diff)` is designed to ignore blocks that already exist on the page where smartblock is executed.  
This is useful if you only want to bring tasks that are newly added to Todoist into Roam.  

You can edit, add or remove filters at any time.  
Roamist will do its best to automatically reflect them, but if you have problems, first try removing the `workflows` block on the `[[roam/roamist]]` page and then reload Roam.  

### 4. Run `Roamist - pull ...` smartblocks

Run smartblocks on any page you like.  
If you have set it up properly so far, you should be able to run smartblocks with a name like `Roamist - pull ...`.  
If there are no tasks in Todoist, nothing will be imported, so make sure you have tasks in Todoist.  

### 5. Place a button on the `[[Roamist]]` page.

Have you been able to import tasks from Todoist?  
The block you have imported will be labeled `#Roamist`. Let's navigate to this page.  
In the first block on `[[Roamist]]` page, enter a block like this.  

```
- `{{Sync todoist completed:42SmartBlock:Roamist - sync completed:button=true,42RemoveButton=false}}`
```

You can use this button to reflect the completion status of Todoist tasks into Roam.
There is no need to change each TODO to DONE on Roam.

## Workflows

> :warning: **This integration recognizes the Todoist id using a tag like `Todoist/1234567890`.**  
> **You must NOT remove this tag.**  
> **If you do, this integration won't work as intended.**

### pull-tasks

- This workflow will pull tasks with the [Todoist's Filters](https://todoist.com/help/articles/introduction-to-filters).
  - You can set your filter in `[[roam/roamist]]`
    - ![CleanShot 2022-02-12 at 02 46 41](https://user-images.githubusercontent.com/15260226/153642825-b1afc320-2204-4783-ba60-a52fa64115a5.png)
- Block will look like this.
  - ![image](https://user-images.githubusercontent.com/15260226/150467089-d564ebe3-cded-4bfe-860e-c6e032b93cd2.png)

### sync-completed

- This workflow will sync completion status from Todoist to Roam Research.
- I recommend you use this workflow as a button in `[[Roamist]]` as follows.
  - `{{Sync todoist completed:42SmartBlock:Roamist - sync completed:button=true,42RemoveButton=false}}`
  - ![CleanShot 2022-01-22 at 00 00 59](https://user-images.githubusercontent.com/15260226/150549391-3d993f6d-2edd-4e8f-bc8b-e7440a4e2236.png)

### complete-task

- This workflow will complete a task under your cursor.
  - After running this workflow, `{{[[TODO]]}}` will turn into `{{[[DONE]]}}` automatically.

### quick-capture (unstable)

![CleanShot 2022-02-12 at 17 47 01](https://user-images.githubusercontent.com/15260226/153704393-56d07cb1-4942-49f6-a07c-e36c6dafdcee.png)

## `roam/css` for priority

- I recommend you set css for todoist's priority.
  - ref. https://roamresearch.com/#/app/help/page/RA1UXmzp0

```css
- #priority/p1 #priority/p2 #priority/p3 #priority/p4
    - ```css
    @import url('https://kdnk.github.io/roamist/src/css/priority.css');
    ```
```

## Inspired

- [dvargas92495/roam42](https://github.com/dvargas92495/roam42)
- [Universal Quick Capture for Roam Research Beta](https://github.com/dvargas92495/SmartBlocks/issues/187)
