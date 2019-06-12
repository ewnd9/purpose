import './styles';

import fs from 'fs';

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import App from './components/shell/shell';
import configureStore from './modules/configure-store';

import {startEventsHandler} from './events';

const dbPath = `${process.env.HOME}/.config/purpose/db.json`; // only Linux for now
const devConsole = console;

const store = configureStore(JSON.parse(fs.readFileSync(dbPath, 'utf-8')));

store.subscribe(() => {
  const state = store.getState();
  fs.writeFile(dbPath, JSON.stringify(state, null, 2), () => {
    devConsole.log('state saved');
  });
});

startEventsHandler({store});
render();

function render() {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root'),
  );
}
