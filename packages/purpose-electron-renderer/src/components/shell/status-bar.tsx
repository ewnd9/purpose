import React from 'react';
import {compose} from 'recompose';
import {connect} from 'react-redux';
import {getItemsStats} from '../../modules/items/items-reducer';
import {getScheduledItemsState} from '../../modules/selectors';
import {setActiveModal, MODAL_SCHEDULE} from '../../modules/ui/ui-actions';
const enhance = compose(
  connect(
    state => ({
      stats: getItemsStats(state),
      scheduledItemsStats: getScheduledItemsState(state),
    }),
    {setActiveModal},
  ),
);
const StatusBarBase = ({stats, setActiveModal, scheduledItemsStats}) => (
  <span className="f6 gray">
    <span>{`Ongoing: ${stats.ongoingCount}`}</span>
    {' | '}
    <span>{`Backlog: ${stats.backlogCount}`}</span>
    {' | '}
    <span>{`Complete: ${stats.completedCount}`}</span>
    {' | '}
    <span>{`Archived: ${stats.archivedCount}`}</span>
    {' | '}
    <span className="pointer" onClick={() => setActiveModal({modal: MODAL_SCHEDULE})}>
      {`schedule (${scheduledItemsStats})`}
    </span>
  </span>
);
export const StatusBar = enhance(StatusBarBase);
