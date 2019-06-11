import { incrementLastId } from "../last-id/last-id-actions";
export const EDIT_ITEM_TEXT = "EDIT_ITEM_TEXT";
export const SET_ITEM_COMPLETED = "SET_ITEM_COMPLETED";
export const ADD_NEW_ITEM = "ADD_NEW_ITEM";
export const REMOVE_ITEM = "REMOVE_ITEM";
export const SET_ITEM_NOTABLE = "SET_ITEM_NOTABLE";
export const SET_ITEM_BACKLOG = "SET_ITEM_BACKLOG";
export const SET_ITEM_ESTIMATE = "SET_ITEM_ESTIMATE";
export const SET_ITEM_SCHEDULE = "SET_ITEM_SCHEDULE";
export function editItemText({ id, text }) {
  return {
    type: EDIT_ITEM_TEXT,
    id,
    text
  };
}
export function setItemCompleted({ id }) {
  return {
    type: SET_ITEM_COMPLETED,
    id
  };
}
export function addNewItem({ text, isActive }) {
  return (dispatch, getState) => {
    const { lastId } = getState();
    const opts = {
      type: ADD_NEW_ITEM,
      id: lastId + 1,
      text,
      isActive
    };
    dispatch(opts);
    dispatch(incrementLastId());
    return opts;
  };
}
export function removeItem({ id }) {
  return {
    type: REMOVE_ITEM,
    id
  };
}
export function setItemNotable({ id }) {
  return {
    type: SET_ITEM_NOTABLE,
    id
  };
}
export function setItemBacklog({ id }) {
  return {
    type: SET_ITEM_BACKLOG,
    id
  };
}
export function setItemEstimate({ id, estimate }) {
  return {
    type: SET_ITEM_ESTIMATE,
    id,
    estimate
  };
}
export function setItemSchedule({ id, schedule }) {
  return {
    type: SET_ITEM_SCHEDULE,
    id,
    schedule
  };
}
