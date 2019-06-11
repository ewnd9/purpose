import orderBy from "lodash/fp/orderBy";
import map from "lodash/fp/map";
import flow from "lodash/fp/flow";
import { createReducer } from "../create-reducer";
import {
  ADD_QUEUE_ITEM,
  SET_QUEUE_ITEM_ORDER,
  REMOVE_QUEUE_ITEM
} from "./queue-actions";
import { SET_ITEM_COMPLETED, SET_ITEM_SCHEDULE } from "../items/items-actions";
export default createReducer([], {
  [ADD_QUEUE_ITEM](state, { id }) {
    const now = new Date();
    const previousQueueItem = state[state.length - 1];
    const order = previousQueueItem ? previousQueueItem.order * 2 : 16;
    const queueItem = {
      id,
      addedAt: now,
      order
    };
    return [...state, queueItem];
  },
  [SET_QUEUE_ITEM_ORDER](state, { id, order }) {
    const index = state.findIndex(_ => _.id === id);
    const item = state[index];
    return [
      ...state.slice(0, index),
      {
        ...item,
        order
      },
      ...state.slice(index + 1)
    ];
  },
  [SET_ITEM_COMPLETED](state, { id }) {
    return removeQueueItem(state, { id });
  },
  [REMOVE_QUEUE_ITEM](state, { id }) {
    return removeQueueItem(state, { id });
  },
  [SET_ITEM_SCHEDULE](state, { id }) {
    return removeQueueItem(state, { id });
  }
});
function removeQueueItem(state, { id }) {
  return [...state].filter(_ => _.id !== id);
}
export function getQueueItems({ items, queue }) {
  return flow(
    orderBy("order", "asc"),
    map(item => {
      item.item = items.find(_ => _.id === item.id);
      return item;
    })
  )(queue);
}
