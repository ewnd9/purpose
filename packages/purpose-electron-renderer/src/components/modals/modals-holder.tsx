import React from 'react';
import {connect} from 'react-redux';
import {compose, withHandlers} from 'recompose';
import {setUiProperty, UI_PROPERTY_ACTIVE_MODAL, MODAL_SCHEDULE} from '../../modules/ui/ui-actions';
import {ScheduleModal} from './schedule-modal';
const enhance = compose(
  connect(
    ({ui}) => ({activeModal: ui.uiProperties[UI_PROPERTY_ACTIVE_MODAL]}),
    {setUiProperty},
  ),
  withHandlers({
    setModalOpened: ({setUiProperty}) => () => {
      setUiProperty({
        key: UI_PROPERTY_ACTIVE_MODAL,
        value: null,
      });
    },
  }),
);
const ModalsHolderBase = ({activeModal, setModalOpened}) => {
  if (!activeModal) {
    return null;
  }
  let component;
  if (activeModal.modal === MODAL_SCHEDULE) {
    component = ScheduleModal;
  } else {
    throw new Error(`unknown modal "${activeModal.key}"`);
  }
  return React.createElement(component, {
    modalOpts: activeModal.modalOpts,
    setModalOpened,
    modalOpened: true,
  });
};
export const ModalsHolder = enhance(ModalsHolderBase);
