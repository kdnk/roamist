import { OnloadArgs } from "roamjs-components/types";

import {
  completeTaskCheckbox,
  observer,
} from "./features/complete-task-checkbox";
import { onload } from "./init";

const init = {
  onload: ({ extensionAPI }: OnloadArgs) => {
    onload(extensionAPI);
    const { observe } = completeTaskCheckbox(extensionAPI);
    observe();
  },
  onunload: () => {
    observer?.disconnect();
  },
};

export default init;
