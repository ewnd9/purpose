import distanceInWordsStrict from 'date-fns/distance_in_words_strict';
import isWeekend from 'date-fns/is_weekend';
import format from 'date-fns/format';
import addDays from 'date-fns/add_days';
import differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
export {isWeekend, addDays};
const localeShort = {
  distanceInWords: {
    localize(type, value, opts) {
      let res = 'UNKNOWN_DATE_TYPE';
      if (type === 'xSeconds') {
        res = `${value}s`;
      } else if (type === 'xMinutes') {
        res = `${value}m`;
      } else if (type === 'xHours') {
        res = `${value}h`;
      } else if (type === 'xDays') {
        res = `${value}d`;
      } else if (type === 'xMonths') {
        res = `${value}M`;
      } else if (type === 'd') {
        res = `${value}d`;
      } else if (type === 'M') {
        res = `${value}M`;
      } else if (type === 'Y') {
        res = `${value}Y`;
      }
      return `${opts.comparison === 1 ? '' : ''}${res}`;
    },
  },
};
export function formatDateAgo(date) {
  return distanceInWordsStrict(date, Date.now(), {
    addSuffix: false,
    locale: localeShort,
  });
}
export function formatDateAgoDays(date) {
  return Math.abs(differenceInCalendarDays(date, Date.now())) + 'd';
}
export function formatDateAgoDaysWithBrackets(date) {
  const ret = Math.abs(differenceInCalendarDays(date, Date.now()));
  return ret === 0 ? '' : ` (${ret}d)`;
}
export function formatDateAfter(date) {
  return Math.abs(differenceInCalendarDays(date, Date.now())) + 'd';
}
export function dayOfWeek(date) {
  return format(date, 'ddd');
}
export function formatChoresDate(date) {
  return format(date, 'MM-DD-YYYY');
}
export function formatChoresDateLabel(date) {
  return format(date, 'MM.DD, ddd');
}
export function parseScheduleTime(item) {
  if (!item.estimate) {
    return 0;
  } else if (item.estimate[item.estimate.length - 1] === 'h') {
    return +item.estimate.slice(0, item.estimate.length - 1) * 60;
  } else {
    return +item.estimate;
  }
}
export function formatTime(minutes) {
  const hh = (minutes / 60) | 0;
  const mm = minutes % 60;
  const ret = [];
  if (hh > 0) {
    ret.push(`${hh}h`);
  }
  if (mm > 0) {
    ret.push(`${mm}m`);
  }
  return ret.join(' ');
}
