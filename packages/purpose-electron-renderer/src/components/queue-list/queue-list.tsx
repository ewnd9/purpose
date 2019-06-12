import React from 'react';
import {connect} from 'react-redux';
import {compose, withHandlers} from 'recompose';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import {Item} from '../item/item-queue';
import {HeaderWithScroll} from '../shell/header-with-scroll';
import {Title} from '../shell/title';
import {getQueueItems} from '../../modules/queue/queue-reducer';
import {setQueueItemOrder, removeQueueItem} from '../../modules/queue/queue-actions';
import {setItemCompleted} from '../../modules/items/items-actions';
const enhance = compose(
  connect(
    ({queue, items}) => ({queueItems: getQueueItems({queue, items})}),
    {removeQueueItem, setItemCompleted, setQueueItemOrder},
  ),
  withHandlers({
    onDragEnd: ({queueItems, setQueueItemOrder}) => result => {
      if (!result.destination || result.source.index === result.destination.index) {
        return;
      }
      const destIndex = result.destination.index;
      let newOrder;
      if (destIndex === 0) {
        newOrder = queueItems[0].order / 2;
      } else if (destIndex === queueItems.length - 1) {
        newOrder = queueItems[queueItems.length - 1].order * 2;
      } else {
        newOrder = (queueItems[destIndex - 1].order + queueItems[destIndex].order) / 2;
      }
      setQueueItemOrder({
        id: result.draggableId,
        order: newOrder,
      });
    },
  }),
);
const QueueList = ({queueItems, removeQueueItem, setItemCompleted, onDragEnd}) => (
  <HeaderWithScroll
    header={<Title>Queue</Title>}
    content={
      <div>
        {(queueItems.length > 0 && (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(dropProvided, dropSnapshot) => (
                <div
                  className="pv3 ph1"
                  ref={dropProvided.innerRef}
                  style={{isDraggingOver: dropSnapshot.isDraggingOver}}
                  {...dropProvided.droppableProps}
                >
                  <div>
                    {queueItems.map(({item, addedAt}, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(dragProvided, dragSnapshot) => (
                          <div>
                            <Item
                              key={item.id}
                              index={index}
                              item={item}
                              addedAt={addedAt}
                              removeQueueItem={removeQueueItem}
                              setItemCompleted={setItemCompleted}
                              isDragging={dragSnapshot.isDragging}
                              provided={dragProvided}
                            />
                            {dragProvided.placeholder}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {dropProvided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )) || <div className="pv3 ph3">Empty</div>}
      </div>
    }
  />
);
export default enhance(QueueList);
