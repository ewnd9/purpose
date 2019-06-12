import {createReducer} from '../create-reducer';
import {SET_UI_PROPERTY} from './ui-actions';
export default createReducer(
  {
    uiProperties: {},
  },
  {
    [SET_UI_PROPERTY](state, {key, value}) {
      const newState = {
        ...state,
        uiProperties: {
          ...state.uiProperties,
          [key]: value,
        },
      };
      return newState;
    },
  },
);
