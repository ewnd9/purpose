import { createReducer } from "../create-reducer";
import { INCREMENT_LAST_ID } from "./last-id-actions";
export default createReducer(0, {
  [INCREMENT_LAST_ID](state) {
    return state + 1;
  }
});
