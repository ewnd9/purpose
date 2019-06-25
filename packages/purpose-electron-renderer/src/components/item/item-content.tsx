import React from 'react';
import snarkdown from 'snarkdown';
import linkify from 'markdown-linkify';

export const ItemContent = ({
  isEditable,
  onClick,
  onKeyDown,
  prefix = '',
  content,
  controlPanel,
  isDragging,
  provided = {},
}) => (
  <div
    className="pt1 pb1 bb-m b--moon-gray fira-mono"
    style={{isDragging}}
    ref={provided.innerRef}
    {...provided.draggableProps}
    {...provided.dragHandleProps}
  >
    <div className="flex flex-row">
      {prefix && <div className="flex items-center mr2">{prefix}</div>}
      <div
        className="flex-auto"
        contentEditable={isEditable}
        onClick={onClick}
        onKeyDown={onKeyDown}
        style={{whiteSpace: 'pre-wrap'}}
        dangerouslySetInnerHTML={{
          __html: isEditable ? content.split('\n').join('<br />') : snarkdown(linkify(content)),
        }}
      />
    </div>
    {controlPanel || null}
  </div>
);
