import containDeep from "jest-expect-contain-deep";
import reducer from "../items-reducer";
import * as actions from "../items-actions";
test("chores-reducer", () => {
  let state = reducer(undefined, {});
  expect(Object.keys(state)).toEqual([]);
  state = reducer(
    state,
    actions.addNewItem({ text: "do something", isActive: false })
  );
  expect(state).toEqual(
    containDeep([
      {
        text: "do something",
        isActive: false
      }
    ])
  );
});
