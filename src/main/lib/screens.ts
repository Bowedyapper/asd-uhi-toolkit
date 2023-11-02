import { app, BrowserWindow, shell } from 'electron';
import { join } from 'path';

export const screens: { [key: string]: BrowserWindow } = {};
const dev = !app.isPackaged;
import icon from '../../../resources/icon.png?asset';
import splash from '../../../resources/splash.html?asset';

const createScreens = (): void => {
  screens.mainWindow = new BrowserWindow({
    frame: false,
    backgroundColor: '#111827',
    titleBarStyle: 'hidden',
    width: dev ? 1400 : 1000,
    height: 700,
    minHeight: 500,
    minWidth: 950,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      spellcheck: false,
      devTools: true,
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  });

  screens.mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (dev && process.env['ELECTRON_RENDERER_URL']) {
    screens.mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    screens.mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }

  screens.splashScreen = new BrowserWindow({
    width: 300,
    height: 300,
    frame: false,
    resizable: false,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true
    }
  });

  screens.splashScreen.loadFile(splash);
};
export default createScreens;
