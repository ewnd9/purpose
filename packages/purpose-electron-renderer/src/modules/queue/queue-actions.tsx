export const ADD_QUEUE_ITEM = 'ADD_QUEUE_ITEM';
export const SET_QUEUE_ITEM_ORDER = 'SET_QUEUE_ITEM_ORDER';
export const REMOVE_QUEUE_ITEM = 'REMOVE_QUEUE_ITEM';
export function addQueueItem({id}) {
  return {
    type: ADD_QUEUE_ITEM,
    id,
  };
}
export function setQueueItemOrder({id, order}) {
  return {
    type: SET_QUEUE_ITEM_ORDER,
    id,
    order,
  };
}
export function removeQueueItem({id}) {
  return {
    type: REMOVE_QUEUE_ITEM,
    id,
  };
}
