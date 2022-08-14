import { OnloadArgs } from "roamjs-components/types";

import { onload } from "./init";

const init = {
  onload: ({ extensionAPI }: OnloadArgs) => {
    onload(extensionAPI);
  },
  onunload: () => {
    // noop
  },
};

export default init;
