export const SET_PROJECT_FOCUS = 'SET_PROJECT_FOCUS';
export const SET_PROJECT_ALWAYS_SHOW = 'SET_PROJECT_ALWAYS_SHOW';
export const SET_PROJECT_PATH = 'SET_PROJECT_PATH';
export const SET_PROJECT_PLAN = 'SET_PROJECT_PLAN';
export const SET_PROJECT_ARCHIVED = 'SET_PROJECT_ARCHIVED';
export function setProjectFocus({name, focus}) {
  return {
    type: SET_PROJECT_FOCUS,
    name,
    focus,
  };
}
export function setProjectAlwaysShow({name, alwaysShow}) {
  return {
    type: SET_PROJECT_ALWAYS_SHOW,
    name,
    alwaysShow,
  };
}
export function setProjectPath({name, path}) {
  return {
    type: SET_PROJECT_PATH,
    name,
    path,
  };
}
export function setProjectPlan({name, plan}) {
  return {
    type: SET_PROJECT_PLAN,
    name,
    plan,
  };
}
export function setProjectArchived({name, archived}) {
  return {
    type: SET_PROJECT_ARCHIVED,
    name,
    archived,
  };
}
