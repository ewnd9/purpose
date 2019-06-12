import flow from 'lodash/fp/flow';
import map from 'lodash/fp/map';
import range from 'lodash/fp/range';
import groupBy from 'lodash/fp/groupBy';
import sum from 'lodash/fp/sum';
import {formatChoresDate, addDays, parseScheduleTime} from '../utils/date-utils';
import {getQueueItems} from './queue/queue-reducer';

export function getRemainingQueueCount(state) {
  const queue = getQueueItems(state);
  return queue.length;
}
export function getScheduledItems(state) {
  const {items} = state;
  const currentDate = Date.now(); // legacy
  const groupsBySchedule = groupBy(item => item.schedule)(items);
  const dates = range(0, 6).map(step => {
    const date = formatChoresDate(addDays(currentDate, step));
    const items = groupsBySchedule[date] || [];
    const totalEstimate = flow(
      map(parseScheduleTime),
      sum,
    )(items);
    return {
      date,
      items,
      totalEstimate,
    };
  });
  return dates;
}
export function getScheduledItemsState(state) {
  const dates = getScheduledItems(state);
  return `${dates.filter(_ => _.items.length > 0).length} / ${dates.length}`;
}
export function getNewSessionDialog(state) {
  const currentDate = Date.now(); // legacy
  const now = Date.now();
  const nowDate = formatChoresDate(now);
  const choresDate = formatChoresDate(currentDate);
  return {
    nowDate,
    choresDate,
    isDialogPending: nowDate !== choresDate, // @TODO better name
  };
}
