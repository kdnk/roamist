/* eslint-disable @typescript-eslint/no-explicit-any */

export async function createDescriptionBlock({
  description,
  currentBlockUid,
  currentIndent,
}: {
  description: string;
  currentBlockUid: any;
  currentIndent: number;
}) {
  const descParentUid = await roam42.common.createBlock(
    currentBlockUid,
    currentIndent + 1,
    `desc::`
  );
  let descBlockUid;
  const descList = description.split(/\r?\n/);
  for (const [descIndex, desc] of descList.entries()) {
    if (descIndex === 0) {
      descBlockUid = await roam42.common.createBlock(
        descParentUid,
        currentIndent + 2,
        desc
      );
    } else {
      descBlockUid = await roam42.common.createSiblingBlock(descBlockUid, desc);
    }
  }
}
