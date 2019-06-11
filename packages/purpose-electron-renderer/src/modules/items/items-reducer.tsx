import { createReducer } from "../create-reducer";
import {
  ADD_NEW_ITEM,
  REMOVE_ITEM,
  EDIT_ITEM_TEXT,
  SET_ITEM_COMPLETED,
  SET_ITEM_NOTABLE,
  SET_ITEM_BACKLOG,
  SET_ITEM_ESTIMATE,
  SET_ITEM_SCHEDULE
} from "./items-actions";
import { ADD_QUEUE_ITEM } from "../queue/queue-actions";
import groupBy from "lodash/fp/groupBy";
import getOr from "lodash/fp/getOr";
export const ONGOING = "ONGOING";
export const COMPLETED = "COMPLETED";
export const BACKLOG = "BACKLOG";
export const DELETED = "DELETED";
export const ARCHIVED = "ARCHIVED";
export default createReducer([], {
  [EDIT_ITEM_TEXT](state, { id, text }) {
    const now = new Date();
    return updateItemById(state, id, item => ({
      ...item,
      text,
      updatedAt: now
    }));
  },
  [SET_ITEM_COMPLETED](state, { id }) {
    const now = new Date();
    return updateItemById(state, id, item => ({
      ...item,
      isCompleted: true,
      isActive: false,
      isBacklog: false,
      isDeleted: false,
      schedule: null,
      updatedAt: now,
      completedAt: now
    }));
  },
  [ADD_NEW_ITEM](state, { id, text, isActive }) {
    const now = new Date();
    const item = {
      id,
      text,
      isActive,
      createdAt: now,
      updatedAt: now
    };
    return [...state, item];
  },
  [REMOVE_ITEM](state, { id }) {
    const now = new Date();
    return updateItemById(state, id, item => ({
      ...item,
      isDeleted: true,
      isCompleted: false,
      isBacklog: false,
      isActive: false,
      updatedAt: now,
      deletedAt: now
    }));
  },
  [SET_ITEM_NOTABLE](state, { id }) {
    const now = new Date();
    return updateItemById(state, id, item => ({
      ...item,
      isNotable: true,
      updatedAt: now
    }));
  },
  [SET_ITEM_BACKLOG](state, { id }) {
    const now = new Date();
    return updateItemById(state, id, item => {
      if (!item.isBacklog) {
        return {
          ...item,
          isBacklog: true,
          isDeleted: false,
          isCompleted: false,
          backlogAt: now,
          updatedAt: now
        };
      } else {
        return {
          ...item,
          isBacklog: false,
          updatedAt: now
        };
      }
    });
  },
  [ADD_QUEUE_ITEM](state, { id }) {
    const now = new Date();
    return updateItemById(state, id, item => ({
      ...item,
      isBacklog: false,
      updatedAt: now
    }));
  },
  [SET_ITEM_ESTIMATE](state, { id, estimate }) {
    const now = new Date();
    return updateItemById(state, id, item => ({
      ...item,
      estimate,
      updatedAt: now
    }));
  },
  [SET_ITEM_SCHEDULE](state, { id, schedule }) {
    const now = new Date();
    return updateItemById(state, id, item => ({
      ...item,
      schedule,
      updatedAt: now
    }));
  }
});
export function groupItems(items) {
  return groupBy(item => {
    if (!item.isDeleted && !item.isCompleted && !item.isBacklog) {
      return ONGOING;
    } else if (item.isCompleted) {
      return COMPLETED;
    } else if (item.isBacklog) {
      return BACKLOG;
    } else if (item.isDeleted) {
      return DELETED;
    }
  })(items);
}
export function groupItemsWithArchived(state) {
  const {
    items,
    projects: { projects }
  } = state;
  return groupBy(item => {
    const projectName = getProjectPrefix(item);
    const project = projects[projectName];
    const archived = project && project.archived;
    if (!item.isDeleted && !item.isCompleted && !item.isBacklog) {
      return archived ? ARCHIVED : ONGOING;
    } else if (item.isCompleted) {
      return COMPLETED;
    } else if (item.isBacklog) {
      return archived ? ARCHIVED : BACKLOG;
    } else if (item.isDeleted) {
      return DELETED;
    }
  })(items);
}
export function getItemsStats(state) {
  const groups = groupItemsWithArchived(state);
  return {
    ongoingCount: getOr([], ONGOING, groups).length,
    backlogCount: getOr([], BACKLOG, groups).length,
    completedCount: getOr([], COMPLETED, groups).length,
    deletedCount: getOr([], DELETED, groups).length,
    archivedCount: getOr([], ARCHIVED, groups).length
  };
}
export function updateItemById(state, id, callback) {
  const index = state.findIndex(_ => _.id === id);
  const item = state[index];
  return [...state.slice(0, index), callback(item), ...state.slice(index + 1)];
}
export function getProjectPrefix(item) {
  const data = item.text.split(":");
  return data.length === 1 ? "z-old" : data[0];
}
