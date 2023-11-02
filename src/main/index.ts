import { app, BrowserWindow, ipcMain, globalShortcut } from 'electron';
import contextMenu from 'electron-context-menu';
import { electronApp, optimizer } from '@electron-toolkit/utils';
import createScreens, { screens } from './lib/screens';
import mainLogger from './helpers/mainLogger';
import rendererLogger from './helpers/rendererLogger';
import gitClone from './lib/git/gitClone';
import getUsers from './lib/git/getUsers';
import extractEvidenceCommits from './lib/git/extractEvidenceCommits';
import getEvidence from './lib/getEvidence';

const dev = !app.isPackaged;

mainLogger.debug('Initialising asd tool....');
mainLogger.debug('App store directory: ' + app.getPath('userData'));

function createWindow(): void {
  // Create the browser window.
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.once('ready', () => {
  setTimeout(() => {
    screens.mainWindow.center();
    screens.mainWindow.show();
    screens.mainWindow.focus();
    screens.splashScreen.close();
  }, 2500);
});

app.whenReady().then(() => {
  globalShortcut.register('CommandOrControl+R', function () {
    mainLogger.info('CommandOrControl+R is pressed, reloading app');
    screens.mainWindow.reload();
  });

  createScreens();
  screens.splashScreen.on('ready-to-show', () => {
    screens.splashScreen.show();
  });

  screens.mainWindow.on('ready-to-show', () => {
    if (dev) {
      screens.mainWindow.webContents.openDevTools();
    }
  });

  contextMenu({
    showLookUpSelection: false,
    showSearchWithGoogle: false,
    showCopyImage: false,
    showInspectElement: dev ? true : false,
    showSelectAll: false,
    prepend: (_defaultActions, _params, _browserWindow) => [
      {
        label: 'placeholder'
      }
    ]
  });
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron');

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('child-process-gone', () => {
  console.log('quit');
});
// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on('quit-app', () => {
  app.quit();
});

ipcMain.on('minimise-app', () => {
  mainLogger.debug('minimise-app invoked');
  screens.mainWindow.minimize();
});

ipcMain.handle('git-clone', async (_event, data) => {
  try {
    const clone = await gitClone(data);
    mainLogger.debug(`git-clone invoked with ${data}`);

    return clone;
  } catch (e) {
    mainLogger.error(`git-clone invoked with ${data} and returned ${e}`);
    return e;
  }
});

ipcMain.handle('get-git-users', async (_event, data) => {
  return new Promise(async (resolve) => {
    // Temporary until i work out why it doesnt wait for users, triggers error in renderer
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const users = getUsers(data);
    mainLogger.debug(`get-git-users invoked with ${data} and returned ${users.length} users`);
    resolve(users);
  });
});

ipcMain.handle('get-year-los', async (_event, data) => {
  try {
    mainLogger.error(`get-year-los invoked with ${data}`);
    const los = await import(`../../resources/outcomes/year-${data}.json`);
    return los;
  } catch (e) {
    mainLogger.error(`get-year-los invoked with ${data} and returned ${e}`);
    return e;
  }
});

ipcMain.handle('get-evidence', async (_event, data) => {
  const evidenceData = [];
  try {
    mainLogger.error(`get-evidence invoked with ${JSON.stringify(data)}`);
    await new Promise((resolve): void =>
      data.repos.forEach(async (repo) => {
        const evidence = await extractEvidenceCommits(repo.url, repo.user);
        //@ts-ignore ignoring type error until i can be bothered to write up the types
        evidenceData.push(...evidence);
        //@ts-ignore
        resolve();
      })
    );

    const e = await getEvidence(data.year, evidenceData.concat());
    return e;
  } catch (e) {
    mainLogger.error(`get-evidence invoked with ${data} and returned ${e}`);
    return e;
  }
});

ipcMain.on('renderer-log', (_event, data) => {
  rendererLogger[data.level](data.message);
});
