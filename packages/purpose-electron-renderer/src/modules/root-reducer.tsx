import {combineReducers} from 'redux';
import items from './items/items-reducer';
import lastId from './last-id/last-id-reducer';
import queue from './queue/queue-reducer';
import quotes from './quotes/quotes-reducer';
import projects from './projects/projects-reducer';
import ui from './ui/ui-reducer';
const rootReducer = combineReducers({
  items,
  lastId,
  queue,
  quotes,
  projects,
  ui,
});
export default rootReducer;
