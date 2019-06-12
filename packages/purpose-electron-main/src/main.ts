import './config';

import path from 'path';
import execa from 'execa';
import {app, ipcMain, globalShortcut, BrowserWindow, Tray} from 'electron';
// const { execFileSync } = require('child_process');
import windowStateKeeper from 'electron-window-state';

import {showNotification, hideNotification} from './notifications/notificationsAwesomeWm';
import {bus} from './socketServer';

let win: BrowserWindow | undefined;
let icon;
let iconPath;

const rootDir = path.resolve(`${__dirname}/..`);

const ICON_PATH = `${rootDir}/public/img/preview.ico`;
const ICON_PATH_BLANK = `${rootDir}/public/img/preview-blank.png`;

const devConsole = console;

process.title = 'purpose';

// app.relaunch();
app.on('ready', () => {
  getWin();

  registerShortcut('super+shift+e', () => {
    devConsole.log('super+e');
    win.webContents.send('GET_QUEUE');
  });

  registerShortcut('super+e', () => {
    devConsole.log('super+e');
    toggleVisibility();
  });

  // registerShortcut('super+w', () => {
  //   devConsole.log('super+w');

  //   const text = execFileSync('xclip', ['-out', '-selection', 'primary']).toString();
  //   win.webContents.send('new-input', { text });
  //   toggleVisibility();
  // });

  bus.on('socket', msg => {
    if (msg.type === 'LOGIN_HOOK') {
      if (msg.status === 'resume') {
        if (!getWin().isVisible()) {
          win.show();
        }

        win.webContents.send('login-hook-resume');
      } else {
        win.webContents.send('login-hook-suspend');
      }
    }
  });

  function toggleVisibility() {
    if (getWin().isVisible()) {
      win.hide();
    } else {
      win.show();
    }
  }
});

function getWin() {
  if (win) {
    return win;
  }

  const indexProd = 'file://' + path.resolve(__dirname, '..', 'public', 'index.html');
  const indexDev = 'file://' + path.resolve(__dirname, '..', 'public', 'index-dev.html');
  const isProd = process.env.NODE_ENV === 'production';
  const indexHtml = isProd ? indexProd : indexDev;

  const mainWindowState = windowStateKeeper({
    defaultWidth: 1000,
    defaultHeight: 800,
  });

  win = new BrowserWindow({
    show: true,
    darkTheme: true,
    width: mainWindowState.width,
    height: mainWindowState.height,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.setMenuBarVisibility(false);
  win.setAutoHideMenuBar(true);

  mainWindowState.manage(win);

  iconPath = ICON_PATH_BLANK;
  icon = new Tray(iconPath);
  icon.on('click', () => {
    devConsole.log('icon click');
    getWin();

    if (win.isVisible()) {
      win.hide();
    } else {
      win.show();
    }
  });

  win.loadURL(indexHtml);

  // if (!isProd) {
  win.webContents.openDevTools({mode: 'right'});
  // }

  win.on('minimize', () => {
    devConsole.log('minimize');
    win.setSkipTaskbar(true);
    win.hide();
  });

  win.on('restore', () => {
    devConsole.log('restore');
    win.setSkipTaskbar(false);
  });

  win.on('closed', () => {
    devConsole.log('closed');
    win = icon = null;
  });

  return win;
}

ipcMain.on('show-notification', function(event, {text, duration}) {
  devConsole.log('show-notification');

  text = text
    .replace(/\\/g, '\\\\')
    .replace(/\$/g, '\\$')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"');

  showNotification({text, duration});
});

ipcMain.on('hide-notification', function() {
  devConsole.log('hide-notification');
  hideNotification();
});

ipcMain.on('SEND_QUEUE', (event, {text}) => {
  showNotification({text, duration: 1});
});

ipcMain.on('SEND_ACTIVITIES_COUNT', (event, {count}) => {
  const newIconPath = count === 0 ? ICON_PATH : ICON_PATH_BLANK;

  if (newIconPath !== iconPath) {
    icon.setImage(newIconPath);
    iconPath = newIconPath;
  }
});

ipcMain.on('OPEN_PROJECT', async (event, {path}) => {
  let tag = 1;
  const res = await execa.shell("wmctrl -l | awk '{print $2}' | grep 1 | wc -l");
  const count = +res.stdout;

  if (count > 0) {
    tag = 3;
  }

  await execa('wmctrl', ['-s', tag]);
  await execa('code', [path.replace('~', process.env.HOME)]);
});

ipcMain.on('OPEN_PLAN', async (event, {plan}) => {
  await execa('wmctrl', ['-s', 5]);
  await execa('atom', [`${process.env.HOME}/Dropbox/plan${plan}`]);
});

function registerShortcut(shorcut, callback) {
  const ret = globalShortcut.register(shorcut, callback);
  devConsole.log(`shorcut ${shorcut} registered: ${ret}`);
}

process.on('unhandledRejection', (err: Error) => {
  devConsole.log(err.stack || err);
});

process.on('uncaughtException', (err: Error) => {
  devConsole.log(err.stack || err);
});
