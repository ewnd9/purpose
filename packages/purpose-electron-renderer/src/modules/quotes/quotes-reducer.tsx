import { createReducer } from "../create-reducer";
export default createReducer([], {
  ADD_TODO(state, action) {
    let text = action.text.trim();
    return [...state, text];
  }
});
