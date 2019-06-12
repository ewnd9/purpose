import React from 'react';
import {connect} from 'react-redux';
import {compose, withProps} from 'recompose';
import format from 'date-fns/format';
import {groupBy, toPairs, fromPairs, sortBy, reverse, filter, flow} from 'lodash/fp';
import {ItemContent} from '../item/item-content';
// const sortKeysAsc = pipe(toPairs, sortBy(0), fromPairs);
const sortKeysDesc = flow(
  toPairs,
  sortBy(0),
  reverse,
  fromPairs,
);
const enhanceHistoryList = compose(
  connect(({items}) => ({items})),
  withProps(({items}) => {
    const itemsByDate = flow(
      filter(item => item.completedAt),
      groupBy(item => format(item.completedAt, 'YYYY-MM-DD (ddd)')),
      sortKeysDesc,
    )(items);
    const groups = Object.keys(itemsByDate);
    return {
      itemsByDate,
      groups,
    };
  }),
);
const HistoryListBase = ({itemsByDate, groups}) => (
  <div className="pv3 ph1 h-100 overflow-y-auto">
    {groups.map(date => (
      <div key={date} className="mb3">
        <div className="mb1 underline">{date}</div>
        <div>
          {itemsByDate[date].map(item => (
            <ItemContent key={item.id} content={item.text} />
          ))}
        </div>
      </div>
    ))}
  </div>
);
const HistoryList = enhanceHistoryList(HistoryListBase);
export default HistoryList;
