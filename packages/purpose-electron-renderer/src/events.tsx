import electron from 'electron';
import {getQueueItems} from './modules/queue/queue-reducer';
import {formatDateAgo} from './utils/date-utils';
import {getFirstLine} from './utils/text';
export function startEventsHandler({store}) {
  onStoreUpdate(store.getState());
  store.subscribe(() => onStoreUpdate(store.getState()));
  electron.ipcRenderer.on('GET_QUEUE', createGetQueueCallback({store}));
}
function onStoreUpdate(state) {
  // checkCount(state);
}

function createGetQueueCallback({store}) {
  return () => {
    const state = store.getState();
    const lines = [];
    const queueLines = getQueueItems(state).map(_ => {
      return `${getFirstLine(_.item.text)} (${formatDateAgo(_.item.createdAt)})`;
    });
    lines.push.apply(lines, queueLines);
    const text = lines.length > 0 ? lines.join('\n') : `Everything is done. Nice`;
    electron.ipcRenderer.send('SEND_QUEUE', {
      text,
    });
  };
}
