import createBlock from "roamjs-components/writes/createBlock";
import getOrderByBlockUid from "roamjs-components/queries/getOrderByBlockUid";
import getParentUidByBlockUid from "roamjs-components/queries/getParentUidByBlockUid";

export const createSiblingBlock = async ({
  fromUid,
  text,
}: {
  fromUid: string;
  text: string;
}) => {
  const parentUid = getParentUidByBlockUid(fromUid);
  const order = getOrderByBlockUid(fromUid);

  const uid = await createBlock({
    parentUid,
    order: order + 1,
    node: {
      text,
    },
  });
  return uid;
};
