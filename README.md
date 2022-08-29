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

1. [Table of Contents](#table-of-contents)
2. [Motivation](#motivation)
3. [Prerequires](#prerequires)
4. [Setup](#setup)
   - [1. Install Roamist](#1.-install-roamist)
   - [2. Configure Roamist](#2.-configure-roamist)
   - [3. See `[[roam/roamist]]`](#3.-see-`[[roam/roamist]]`)
   - [4. Run `Roamist - pull ...` smartblocks](#4.-run-`roamist---pull-...`-smartblocks)
   - [5. Place a button on the `[[Roamist]]` page.](#5.-place-a-button-on-the-`[[roamist]]`-page.)
5. [Workflows](#workflows)
   - [pull-tasks](#pull-tasks)
   - [sync-completed](#sync-completed)
   - [complete-task](#complete-task)
   - [quick-capture](#quick-capture)
6. [`roam/css` for priority](#`roam/css`-for-priority)
7. [Inspired](#inspired)

## Motivation

I have been using Todoist as my task management tool for a long time.  
I still think that Roam Research is the best note-taking tool, but Todoist is more suitable for task management.

Since I started using Roam Research, I've wondered if it would be possible to use Todoist for task management but take detailed notes for each task in Roam Research.

Roamist is one way to make this possible. With this integration, you can copy tasks from Todoist to Roam Research, complete Todoist tasks from within Roam Reasearch, and synchronize task completion status between Todoist and Roam Reserach.

## Prerequires

- Todoist’s api token
  - See: https://developer.todoist.com/rest/v1/#javascript-sdk
  - You can get your token on https://todoist.com/prefs/integrations.
- SmartBlocks (You can install it through roam-depot)
  - https://roamjs.com/extensions/smartblocks

## Setup

<img width="1000" alt="CleanShot 2022-08-26 at 16 28 55@2x" src="https://user-images.githubusercontent.com/15260226/186848218-fe46eeae-937f-4f3d-b6f7-b5ed9fea6555.png">

### 1. Install Roamist

- Install Roamist through roam-depot.
- You can see `[[roam/roamist]]` is created.

### 2. Configure Roamist

- Fill `Todoist's token`, and `Todoist filters`.
  - `Todoist's token`
    - You can get your token via todoist.com/prefs/integrations.
  - `Todoist filters`
    - left:
      - Name of your filter.
        - ex. `Today's work`
    - right:
      - Todoist filter. https://todoist.com/help/articles/205248842.
        - ex. `(today | overdue) & #Work`

### 3. See `[[roam/roamist]]`

- You can see some blocks are added automatically if you set `Todoist filters` correctlly.
  - Please don't modify blocks of this page. That makes Roamist broken.
- `Roamist - pull today (only diff)` is designed to ignore blocks that already exist on the page where smartblock is executed.
  - This is useful if you only want to bring tasks that are newly added to Todoist into Roam.

You can edit, add or remove filters at any time.  
Roamist will do its best to automatically reflect them, but if you have problems, first try removing the `workflows` block on the `[[roam/roamist]]` page and then reload Roam.

### 4. Run `Roamist - pull ...` smartblocks

- Run smartblocks on any page you like.
  - If you have set it up properly so far, you should be able to run smartblocks with a name like `Roamist - pull ...`.
  - If there are no tasks in Todoist, nothing will be imported, so make sure you have tasks in Todoist.

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
> **If you do, Roamist won't work as intended.**

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

### quick-capture

- This workflow pulls Todoist's tasks.
  - `Todoist's filter for quick Capture` is used.
  - Unlike pull-tasks, this workflow marks Todoist's tasks as completed.
  - ex. If you set like `#Quick Caputure`, whole tasks in `Quick Capture` product of todoist will be copied, and original tasks are marked as completed.

## `roam/css` for priority

- I recommend you set css for todoist's priority.
  - ref. https://roamresearch.com/#/app/help/page/RA1UXmzp0

````css
- #priority/p1 #priority/p2 #priority/p3 #priority/p4
    - ```css
    @import url('https://kdnk.github.io/roamist/style.css');
    ```
````

## Inspired

- [dvargas92495/roam42](https://github.com/dvargas92495/roam42)
- [Universal Quick Capture for Roam Research Beta](https://github.com/dvargas92495/SmartBlocks/issues/187)
