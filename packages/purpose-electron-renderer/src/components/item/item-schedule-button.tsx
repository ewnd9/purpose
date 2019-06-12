import React from 'react';
import {connect} from 'react-redux';
import cx from 'classnames';
import {ItemControlButton} from './item-control-button';
import {formatDateAfter} from '../../utils/date-utils';
import {setActiveModal, MODAL_SCHEDULE} from '../../modules/ui/ui-actions';
const enhance = connect(
  null,
  {setActiveModal},
);
export const ItemScheduleButtonBase = ({id, schedule, setActiveModal}) => (
  <ItemControlButton>
    <span
      className={cx({'fat-purple-underline': !!schedule})}
      onClick={() =>
        setActiveModal({
          modal: MODAL_SCHEDULE,
          modalOpts: {id},
        })
      }
    >
      {(schedule && `schedule:${formatDateAfter(schedule)}`) || `schedule`}
    </span>
  </ItemControlButton>
);
export const ItemScheduleButton = enhance(ItemScheduleButtonBase);
