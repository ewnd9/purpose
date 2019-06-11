import React from "react";
import { formatDateAgo } from "../../utils/date-utils";
import { withContentEditable } from "./content-editable-hoc";
import { ItemContent } from "./item-content";
import { ItemControlButton } from "./item-control-button";
import { ItemCopyButton } from "./item-copy-button";
import { ItemEstimateField } from "./item-estimate-field";
import { ItemScheduleButton } from "./item-schedule-button";
const ItemBase = ({
  item,
  removeItem,
  setItemCompleted,
  setEditable,
  onTextKeyPress,
  isEditable,
  setItemNotable,
  setItemBacklog,
  queueItems,
  addQueueItem
}) => {
  const queueIndex = queueItems.findIndex(_ => _.id === item.id);
  return (
    <ItemContent
      isEditable={isEditable}
      onClick={setEditable}
      onKeyDown={onTextKeyPress}
      content={item.text}
      controlPanel={
        <div>
          {(queueIndex > -1 && (
            <span className="f8 underline">{`${queueIndex +
              1}th in queue`}</span>
          )) || (
            <ItemControlButton onClick={addQueueItem}>
              enqueue
            </ItemControlButton>
          )}{" "}
          {(!item.isCompleted && (
            <React.Fragment>
              <ItemControlButton onClick={setItemCompleted}>
                complete
              </ItemControlButton>{" "}
            </React.Fragment>
          )) ||
            null}
          <ItemControlButton bold={item.isNotable} onClick={setItemNotable}>
            notable
          </ItemControlButton>{" "}
          <ItemControlButton onClick={setItemBacklog}>
            {item.isBacklog ? "not backlog" : "backlog"}
          </ItemControlButton>{" "}
          {(!item.isDeleted && (
            <React.Fragment>
              <ItemControlButton onClick={removeItem}>remove</ItemControlButton>{" "}
            </React.Fragment>
          )) ||
            null}
          <ItemCopyButton text={item.text} />{" "}
          {(!item.isDeleted && !item.isCompleted && (
            <React.Fragment>
              <ItemEstimateField id={item.id} estimate={item.estimate} />{" "}
            </React.Fragment>
          )) ||
            null}
          {(item.estimate && !item.isCompleted && (
            <React.Fragment>
              <ItemScheduleButton id={item.id} schedule={item.schedule} />{" "}
            </React.Fragment>
          )) ||
            null}
          <span className="f8 underline">{formatDateAgo(item.createdAt)}</span>
        </div>
      }
    />
  );
};
export const Item = withContentEditable(ItemBase);
