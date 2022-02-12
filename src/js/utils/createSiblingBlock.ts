import {
  createBlock,
  getOrderByBlockUid,
  getParentUidByBlockUid,
} from "roamjs-components";

export const createSiblingBlock = async ({
  fromUid,
  text,
}: {
  fromUid: string;
  text: string;
}) => {
  const parentUid = getParentUidByBlockUid(fromUid);
  const order = getOrderByBlockUid(parentUid);

  const uid = await createBlock({
    parentUid,
    order: order + 1,
    node: {
      text,
    },
  });
  return uid;
};
