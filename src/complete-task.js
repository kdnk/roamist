/* vim: set sw=2 sts=2 ts=2 et: */

// (async function () {
//   await window.roamTodoistIntegration.completeTask();
// })();

window.roamTodoistIntegration.completeTask = async () => {
  const TODOIST_TOKEN = window.TODOIST_TOKEN;

  const blockUid = roam42.common.currentActiveBlockUID();
  const blockInfo = await roam42.common.getBlockInfoByUID(blockUid);
  const block = blockInfo[0][0];
  const text = block?.string;
  const res = text.match(/\d{10}/);
  const url = "https://api.todoist.com/rest/v1/tasks/" + res + "/close";

  const bearer = "Bearer " + TODOIST_TOKEN;
  await fetch(url, {
    method: "POST",
    headers: {
      Authorization: bearer,
    },
  });

  const newContent = block.string.replace("{{[[TODO]]}}", "{{[[DONE]]}}");
  await roam42.common.updateBlock(blockUid, newContent);

  return "";
};
