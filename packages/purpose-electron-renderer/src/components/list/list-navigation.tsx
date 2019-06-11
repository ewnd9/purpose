import React from "react";
import cx from "classnames";
import {
  ONGOING,
  COMPLETED,
  BACKLOG,
  DELETED
} from "../../modules/items/items-reducer";
import { ipcRenderer } from "electron"; // @TODO bad, add nanobus to proxy to electron in single file
export const Navigation = ({
  activeProject,
  activeGroup,
  setActiveGroup,
  activeFilter,
  setActiveFilter,
  showEmptyGroups,
  setShowEmptyGroups,
  isSettingsOpen,
  setIsSettingsOpen,
  groupsList,
  activeGroupObject
}) => (
  <nav>
    <div className="overflow-x-auto">
      {groupsList
        .filter(_ => _.isVisible)
        .map(({ groupName, isFocused, ongoingCount }) => (
          <a
            key={groupName}
            className={cx("gray f5 dib mr3 outline-0 no-underline", {
              "fat-purple-underline": isFocused,
              b: groupName === activeGroup
            })}
            href="#"
            title="Link 1"
            onClick={() => setActiveGroup(groupName)}
          >
            {`${groupName}` + (ongoingCount > 0 ? ` (${ongoingCount})` : "")}
          </a>
        ))}
    </div>
    <div className="overflow-x-auto mt3 flex flex-row">
      <div className="flex flex-auto items-center">
        <NavigationFilterItem
          label="Ongoing"
          value={ONGOING}
          activeGroupObject={activeGroupObject}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />

        <NavigationFilterItem
          label="Backlog"
          value={BACKLOG}
          activeGroupObject={activeGroupObject}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />

        <NavigationFilterItem
          label="Completed"
          value={COMPLETED}
          activeGroupObject={activeGroupObject}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />

        <NavigationFilterItem
          label="Deleted"
          value={DELETED}
          activeGroupObject={activeGroupObject}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
      </div>
      <div>
        <span className="dip f5 gray mr3">
          <span
            className="pointer"
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          >
            {isSettingsOpen ? "✔️" : "⚙"}
          </span>
        </span>
        <div className="inline-flex dip items-center f5 gray">
          <Checkbox
            id="showEmpty"
            value={showEmptyGroups}
            label="Empty"
            onChange={e => setShowEmptyGroups(e.target.checked)}
          />
        </div>
      </div>
    </div>
    {(activeProject && activeProject.path && (
      <div className="mt1 gray">
        Path:{" "}
        <span
          className="underline pointer"
          onClick={() =>
            ipcRenderer.send("OPEN_PROJECT", { path: activeProject.path })
          }
        >
          {activeProject.path}
        </span>
      </div>
    )) ||
      null}
    {(activeProject && activeProject.plan && (
      <div className="mt1 gray">
        Plan:{" "}
        <span
          className="underline pointer"
          onClick={() =>
            ipcRenderer.send("OPEN_PLAN", { plan: activeProject.plan })
          }
        >
          {activeProject.plan}
        </span>
      </div>
    )) ||
      null}
  </nav>
);
const NavigationFilterItem = ({
  value,
  label,
  activeGroupObject,
  activeFilter,
  setActiveFilter
}) => (
  <a
    href="#"
    className={cx("gray f5 dib mr3 outline-0 outline-0 no-underline", {
      b: activeFilter === value
    })}
    onClick={() => setActiveFilter(value)}
  >
    {`${label} (${
      ((activeGroupObject && activeGroupObject.itemsByFilter[value]) || [])
        .length
    })`}
  </a>
);
export const Checkbox = ({ id, label, value, onChange }) => (
  <React.Fragment>
    <input
      type="checkbox"
      className="mr2"
      id={id}
      type="checkbox"
      defaultChecked={value}
      onChange={onChange}
    />

    <label htmlFor={id} className="lh-copy">
      {label}
    </label>
  </React.Fragment>
);
