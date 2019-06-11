export const SET_UI_PROPERTY = "SET_UI_PROPERTY";
export const UI_PROPERTY_ACTIVE_PROJECT = "UI_PROPERTY_ACTIVE_PROJECT";
export const UI_PROPERTY_ACTIVE_MODAL = "UI_PROPERTY_ACTIVE_MODAL";
export const MODAL_SCHEDULE = "MODAL_SCHEDULE";
export function setUiProperty({ key, value }) {
  return {
    type: SET_UI_PROPERTY,
    key,
    value
  };
}
export function setActiveModal({ modal, modalOpts = {} }) {
  return {
    type: SET_UI_PROPERTY,
    key: UI_PROPERTY_ACTIVE_MODAL,
    value: {
      modal,
      modalOpts
    }
  };
}
