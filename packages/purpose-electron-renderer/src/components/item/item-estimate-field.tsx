import React from 'react';
import {compose, withHandlers} from 'recompose';
import {connect} from 'react-redux';
import {setItemEstimate} from '../../modules/items/items-actions';
import {withContentEditable2} from './content-editable-hoc';
const enhance = compose(
  connect(
    null,
    {setItemEstimate},
  ),
  withHandlers({
    onChange: ({id, setItemEstimate}) => text => {
      text = text.trim();
      if (text.match(/^[\d\.]+h?$/)) {
        setItemEstimate({id, estimate: text});
      } else {
        alert(`incorrect format ${text}`); // @TODO proper notifications
      }
    },
  }),
  withContentEditable2,
);
export const ItemEstimateFieldBase = ({onTextKeyPress, isEditable, setEditable, estimate}) => (
  <span className="f8 underline">
    <span>est:</span>
    <span
      className="flex-auto"
      contentEditable={isEditable}
      onClick={setEditable}
      onKeyDown={onTextKeyPress}
      style={{whiteSpace: 'pre-wrap'}}
      dangerouslySetInnerHTML={{__html: estimate || 'no'}}
    />
  </span>
);
export const ItemEstimateField = enhance(ItemEstimateFieldBase);
