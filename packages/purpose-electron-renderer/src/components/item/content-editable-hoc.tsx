import { connect } from "react-redux";
import { compose, withHandlers, withState } from "recompose";
import { editItemText } from "../../modules/items/items-actions";
export const withContentEditable2 = compose(
  withState("isEditable", "setIsEditable", false),
  withHandlers({
    onTextKeyPress: ({ setIsEditable, onChange }) => e => {
      if (e.keyCode !== 13) {
        return;
      }
      if (e.ctrlKey) {
        // https://stackoverflow.com/a/12957539/2544668
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const br = document.createElement("br");
        const textNode = document.createTextNode("\u00a0"); // Passing " " directly will not end up being shown correctly
        range.deleteContents(); //required or not?
        range.insertNode(br);
        range.collapse(false);
        range.insertNode(textNode);
        range.selectNodeContents(textNode);
        range.deleteContents();
        selection.removeAllRanges();
        selection.addRange(range);
        return;
      }
      e.preventDefault();
      setIsEditable(false);
      onChange(e.target.innerText);
    },
    setEditable: ({ setIsEditable }) => () => setIsEditable(true)
  })
);
export const withContentEditable = compose(
  connect(
    null,
    { editItemText }
  ),
  withHandlers({
    onChange: ({ item, editItemText }) => text =>
      editItemText({ id: item.id, text })
  }),
  withContentEditable2
);
