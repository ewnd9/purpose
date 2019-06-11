import { createReducer } from "../create-reducer";
import {
  SET_PROJECT_FOCUS,
  SET_PROJECT_ALWAYS_SHOW,
  SET_PROJECT_PATH,
  SET_PROJECT_PLAN,
  SET_PROJECT_ARCHIVED
} from "./projects-actions";
export default createReducer(
  {
    projects: {}
  },
  {
    [SET_PROJECT_FOCUS](state, { name, focus }) {
      return updateProject(state, name, project => ({
        ...project,
        focus
      }));
    },
    [SET_PROJECT_ALWAYS_SHOW](state, { name, alwaysShow }) {
      return updateProject(state, name, project => ({
        ...project,
        alwaysShow
      }));
    },
    [SET_PROJECT_PATH](state, { name, path }) {
      return updateProject(state, name, project => ({
        ...project,
        path
      }));
    },
    [SET_PROJECT_PLAN](state, { name, plan }) {
      return updateProject(state, name, project => ({
        ...project,
        plan
      }));
    },
    [SET_PROJECT_ARCHIVED](state, { name, archived }) {
      return updateProject(state, name, project => ({
        ...project,
        archived
      }));
    }
  }
);
function updateProject(state, name, callback) {
  const now = new Date();
  const project = state.projects[name] || {
    name,
    createdAt: now,
    updatedAt: now
  };
  return {
    ...state,
    projects: {
      ...state.projects,
      [name]: {
        ...callback(project),
        updatedAt: now
      }
    }
  };
}
