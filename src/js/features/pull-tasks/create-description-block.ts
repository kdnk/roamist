/* eslint-disable @typescript-eslint/no-explicit-any */

import { createBlock } from "roamjs-components";

export async function createDescriptionBlock({
  description,
  currentBlockUid,
}: {
  description: string;
  currentBlockUid: any;
}) {
  const descParentUid = await createBlock({
    parentUid: currentBlockUid,
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
