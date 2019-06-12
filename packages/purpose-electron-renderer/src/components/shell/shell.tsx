import React from 'react';
import {connect} from 'react-redux';
import {compose, withStateHandlers, lifecycle} from 'recompose';
import {ipcRenderer} from 'electron';
import cx from 'classnames';
import {StatefulToolTip} from 'react-portal-tooltip';
import List from '../list/list';
import HistoryList from '../history-list/history-list';
import QueueList from '../queue-list/queue-list';
import {StatusBar} from './status-bar';
import {ModalsHolder} from '../modals/modals-holder';
import {getQueueItems} from '../../modules/queue/queue-reducer';
import historyIcon from '../../img/stack.svg';
import tasksIcon from '../../img/database.svg';
import queueIcon from '../../img/list2.svg';

const QUEUE_PAGE = 'queue';
const TASKS_PAGE = 'tasks';
const HISTORY_PAGE = 'history';

const hotkeyMapping = {
  1: QUEUE_PAGE,
  2: TASKS_PAGE,
  3: HISTORY_PAGE,
};

const enhance = compose(
  connect(state => ({
    queueItemsCount: getQueueItems(state).length,
  })),
  withStateHandlers(
    () => ({
      mode: QUEUE_PAGE,
    }),
    {
      changeMode: () => mode => ({
        mode,
      }),
    },
  ),
  lifecycle({
    componentDidMount() {
      const {changeMode, recordEvent} = this.props;
      this.cb = e => {
        if (!e.altKey) {
          return;
        }
        const mode = hotkeyMapping[e.key];
        if (mode) {
          changeMode(mode);
        }
      };
      document.addEventListener('keydown', this.cb);
    },
    componentWillUnmount() {
      document.removeEventListener('keydown', this.cb);
    },
  }),
);
const SIDE_BAR_WIDTH = '48px'; // icon size
// bg-near-black hover-bg-gray
const Menu = ({mode, changeMode, queueItemsCount, items}) => {
  const leftMenu = [
    {
      id: 'queue',
      icon: queueIcon,
      bandgeCount: queueItemsCount,
      component: <QueueList />,
    },
    {
      id: 'tasks',
      icon: tasksIcon,
      component: <List />,
    },
    {
      id: 'history',
      icon: historyIcon,
      component: <HistoryList items={items} />,
    },
  ];
  return (
    <div className="flex flex-column h-100 bg-whitess">
      <div className="flex-auto h-100 relative bb b--moon-gray">
        <div
          className="absolute top-0 left-0 bottom-0 right-0 br b--moon-gray"
          style={{width: SIDE_BAR_WIDTH, wordWrap: 'break-word'}}
        >
          <ul className="list ml0 pl0 mt0">
            {leftMenu.map(({id, icon, bandgeCount}) => {
              const parent = (
                <React.Fragment>
                  <a
                    className="no-underline near-white bg-animate inline-flex items-center ma2 tc br2 pa2"
                    onClick={() => changeMode(id)}
                  >
                    <img className="dib h2 w2" src={icon} />
                  </a>

                  {(bandgeCount && (
                    <span className="absolute f7" style={{right: 5, bottom: 5}}>
                      {bandgeCount}
                    </span>
                  )) ||
                    null}
                </React.Fragment>
              );
              return (
                <li key={id} className={cx('relative', {'bg-light-gray': mode === id})}>
                  <StatefulToolTip parent={parent} tooltipTimeout={50} useHover={false}>
                    {id}
                  </StatefulToolTip>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="h-100" style={{marginLeft: SIDE_BAR_WIDTH, wordWrap: 'break-word'}}>
          {leftMenu.find(_ => _.id === mode).component}
        </div>
      </div>
      <div className="pv1 ph2">
        <StatusBar changeMode={changeMode} />
      </div>
      <ModalsHolder />
    </div>
  );
};
export default enhance(Menu);
