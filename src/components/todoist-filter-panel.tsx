import React, { useState, useEffect, useRef, useMemo } from "react";
import { Button, InputGroup } from "@blueprintjs/core";
import type { OnloadArgs } from "roamjs-components/types";

import { getTodoistFilterConfigs } from "../js/features/pull-tasks/get-todoist-filter-configs";
import { installWorkflows } from "../js/install-workflows";

type Props = {
  extensionAPI: OnloadArgs["extensionAPI"];
};
export const TodoistFilterPanel: React.FC<Props> = (props) => {
  const [filterConfigs, setFilterConfigs] = useState(() =>
    getTodoistFilterConfigs(props.extensionAPI)
  );
  const [filter, setFilter] = useState("");
  const [filterName, setFilterName] = useState("");
  const filterNameRef = useRef<HTMLInputElement>(null);
  const filterRef = useRef<HTMLInputElement>(null);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    if (!filterNameRef?.current) {
      return;
    }
    filterNameRef.current.className = "rm-extensions-settings";
    filterNameRef.current.style.minWidth = "100%";
    filterNameRef.current.style.maxWidth = "100%";
  }, [filterNameRef]);

  useEffect(() => {
    if (!filterRef?.current) {
      return;
    }
    filterRef.current.className = "rm-extensions-settings";
    filterRef.current.style.minWidth = "100%";
    filterRef.current.style.maxWidth = "100%";
  }, [filterRef]);

  const filterNames = useMemo(() => {
    return filterConfigs.map((config) => config.name);
  }, [filterConfigs]);

  const isNewName = useMemo(() => {
    return !filterNames.includes(filterName);
  }, [filterNames, filterName]);

  useEffect(() => {
    const run = async () => {
      if (installing) {
        return;
      }
      setInstalling(true);
      await installWorkflows(props.extensionAPI);
      setInstalling(false);
    };
    run();
  }, [filterConfigs]);

  return (
    <div
      className="flex flex-col"
      style={{
        width: "100%",
        minWidth: 500,
      }}
    >
      <div className={"flex gap-2"}>
        <InputGroup
          className="w-full"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          inputRef={filterNameRef}
          placeholder="today's work"
        />
        <InputGroup
          className="w-full"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          inputRef={filterRef}
          placeholder={"today & #Work & !#Inbox"}
        />
        <Button
          icon={"plus"}
          minimal
          disabled={!filterName || !filter || !isNewName || installing}
          onClick={() => {
            const newFilterConfigs = [
              ...filterConfigs,
              { name: filterName, filter },
            ];
            setFilterConfigs(newFilterConfigs);
            props.extensionAPI.settings.set(
              "todoist-filter-configs",
              newFilterConfigs
            );
            setFilter("");
            setFilterName("");
          }}
        />
      </div>
      {filterConfigs.map((p, index) => {
        return (
          <div key={index} className="flex items-center justify-between">
            <span
              title={`${p.name}: ${p.filter}`}
              style={{
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {p.name}: {p.filter}
            </span>
            <Button
              icon={"trash"}
              disabled={installing}
              minimal
              onClick={() => {
                const newFilters = filterConfigs.filter(
                  (_, jndex) => index !== jndex
                );
                setFilterConfigs(newFilters);
                props.extensionAPI.settings.set(
                  "todoist-filter-configs",
                  newFilters
                );
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
