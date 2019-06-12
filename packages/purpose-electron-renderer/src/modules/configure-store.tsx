import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './root-reducer';
let middleware = [thunkMiddleware.withExtraArgument({})];
if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
  const logger = require('redux-logger').createLogger({collapsed: true});
  middleware = [...middleware, logger];
}
const createStoreWithMiddleware = applyMiddleware(...middleware)(createStore);
const devConsole = console;
export default function configureStore(initialState) {
  const store = createStoreWithMiddleware(rootReducer, initialState);
  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = require('./root-reducer').default;
      store.replaceReducer(nextRootReducer);
    });
  }
  if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
    devConsole.log(store.getState());
  }
  return store;
}
