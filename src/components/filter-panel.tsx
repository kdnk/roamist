import { Button, InputGroup } from "@blueprintjs/core";
import React from "react";
import type { OnloadArgs } from "roamjs-components/types";

export const getTodoistFilters = (extensionAPI: OnloadArgs["extensionAPI"]) => {
  const value = extensionAPI.settings.get("todoist-filters") as
    | string[]
    | string;
  return typeof value === "string" ? [value] : value;
};

export const TodoistFilterPanel =
  (extensionAPI: OnloadArgs["extensionAPI"]) => () => {
    const [filters, setFilters] = React.useState(() =>
      getTodoistFilters(extensionAPI)
    );
    const [value, setValue] = React.useState("");
    const inputRef = React.useRef<HTMLInputElement>(null);
    React.useEffect(() => {
      if (!inputRef.current) {
        return;
      }
      inputRef.current.className = "rm-extensions-settings";
      if (!inputRef.current.style) {
        console.log(inputRef);
      }
      inputRef.current.style.minWidth = "100%";
      inputRef.current.style.maxWidth = "100%";
    }, [inputRef]);

    return (
      <div
        className="flex flex-col"
        style={{
          width: "100%",
          minWidth: 256,
        }}
      >
        <div className={"flex gap-2"}>
          <InputGroup
            value={value}
            onChange={(e) => setValue(e.target.value)}
            inputRef={inputRef}
          />
          <Button
            icon={"plus"}
            minimal
            disabled={!value}
            onClick={() => {
              const newFilters = [...filters, value];
              setFilters(newFilters);
              extensionAPI.settings.set("todoist-filters", newFilters);
              setValue("");
            }}
          />
        </div>
        {filters.map((filter, index) => (
          <div key={index} className="flex items-center justify-between">
            <span
              style={{
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {filter}
            </span>
            <Button
              icon={"trash"}
              minimal
              onClick={() => {
                const newTexts = filters.filter((_, jndex) => index !== jndex);
                setFilters(newTexts);
                extensionAPI.settings.set("todoist-filters", newTexts);
              }}
            />
          </div>
        ))}
      </div>
    );
  };
