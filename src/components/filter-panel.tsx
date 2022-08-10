import type TReact from "react";
import type { OnloadArgs } from "roamjs-components/types";

export const getTodoistFilters = (extensionAPI: OnloadArgs["extensionAPI"]) => {
  const value = extensionAPI.settings.get("todoist-filters") as
    | string[]
    | string;
  return typeof value === "string" ? [value] : value;
};

const React = window.React as typeof TReact;

type Props = {
  extensionAPI: OnloadArgs["extensionAPI"];
};
export const TodoistFilterPanel: React.FC<Props> = (props) => {
  // eslint-disable-next-line
  console.log("[filter-panel.tsx:17] props: ", props);
  const [open, _isOpen] = React.useState("hello");
  return <div>{open}</div>;
};
