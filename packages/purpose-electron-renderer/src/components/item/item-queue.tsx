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
  index,
  removeQueueItem,
  setItemCompleted,
  setEditable,
  onTextKeyPress,
  isEditable,
  addedAt,
  isDragging,
  provided
}) => {
  return (
    <ItemContent
      key={item.id}
      isEditable={isEditable}
      onClick={setEditable}
      onKeyDown={onTextKeyPress}
      prefix={`${index + 1}. `}
      content={item.text}
      isDragging={isDragging}
      provided={provided}
      controlPanel={
        <div>
          <ItemControlButton onClick={() => setItemCompleted({ id: item.id })}>
            complete
          </ItemControlButton>{" "}
          <ItemControlButton onClick={() => removeQueueItem({ id: item.id })}>
            remove
          </ItemControlButton>{" "}
          <ItemCopyButton text={item.text} />{" "}
          <ItemEstimateField id={item.id} estimate={item.estimate} />{" "}
          {(item.estimate && (
            <React.Fragment>
              <ItemScheduleButton id={item.id} schedule={item.schedule} />{" "}
            </React.Fragment>
          )) ||
            null}
          <span className="f8 underline">{formatDateAgo(addedAt)}</span>
        </div>
      }
    />
  );
};
export const Item = withContentEditable(ItemBase);
