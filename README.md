# roam-todoist-integration

## Prerequires

- Todoist’s api token
  - See: https://developer.todoist.com/rest/v1/#javascript-sdk
  - You can get your token from https://todoist.com/prefs/integrations.
- roam42
  - https://roamjs.com/extensions/roam42
- smartblocks
  - https://roamjs.com/extensions/smartblocks

## How to use

```javascript
window.TODOIST_TOKEN = "put your todoist token";
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

