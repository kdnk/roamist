import createBlock from "roamjs-components/writes/createBlock";

export async function createDescriptionBlock({
  description,
  taskBlockUid,
}: {
  description: string;
  taskBlockUid: string;
}) {
  const descParentUid = await createBlock({
    parentUid: taskBlockUid,
    node: { text: `desc::` },
  });
  const descList = description.split(/\r?\n/);
  for (const [descIndex, desc] of descList.entries()) {
    await createBlock({
      parentUid: descParentUid,
      order: descIndex,
      node: { text: desc },
    });
  }
}
