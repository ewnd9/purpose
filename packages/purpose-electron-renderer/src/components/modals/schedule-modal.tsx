import React from 'react';
import {connect} from 'react-redux';
import {compose, withHandlers} from 'recompose';
import pluralize from 'pluralize';
import cx from 'classnames';
import Modal from 'react-modal';
import {setItemSchedule} from '../../modules/items/items-actions';
import {getScheduledItems} from '../../modules/selectors';
import {dayOfWeek, formatTime, parseScheduleTime} from '../../utils/date-utils';
import {getFirstLine} from '../../utils/text';
export const enhance = compose(
  connect(
    state => ({
      scheduledItems: getScheduledItems(state),
    }),
    {setItemSchedule},
  ),
  withHandlers({
    onDateSelect: ({modalOpts: {id}, setItemSchedule, setModalOpened}) => date => {
      setItemSchedule({id, schedule: date});
      setModalOpened(false);
    },
  }),
);
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    minWidth: '400px',
    maxWidth: '80%',
  },
};
export const ScheduleModalBase = ({modalOpts: {id}, setModalOpened, modalOpened, scheduledItems, onDateSelect}) => (
  <Modal
    isOpen={modalOpened}
    onRequestClose={() => setModalOpened(false)}
    style={customStyles}
    contentLabel="Example Modal"
    ariaHideApp={false}
  >
    <div className="underline">{id ? 'Pick a date' : 'Schedule'}</div>
    <div className="mt3 fira-mono">
      {scheduledItems.slice(id ? 1 : 0).map(({date, items, totalEstimate}) => (
        <div key={date}>
          <div>
            <div className={cx('dib mv1', {pointer: !!id})} onClick={id ? () => onDateSelect(date) : null}>
              <span>{'- '}</span>
              <span className="underline">{`${date}`}</span>
              <span>{` ${dayOfWeek(date)} `}</span>
              <span>
                {items.length > 0
                  ? `(${formatTime(totalEstimate)}, ${items.length} ${pluralize('item', items.length)})`
                  : ''}
              </span>
            </div>
            {items.map(item => (
              <div key={item.id} className="ml3">
                {`- ${getFirstLine(item.text)} (${formatTime(parseScheduleTime(item))})`}
              </div>
            ))}
          </div>
        </div>
      ))}

      {(id && (
        <div className="underline pointer mv1" onClick={() => onDateSelect(null)}>
          Unschedule
        </div>
      )) ||
        null}
    </div>
  </Modal>
);
export const ScheduleModal = enhance(ScheduleModalBase);
