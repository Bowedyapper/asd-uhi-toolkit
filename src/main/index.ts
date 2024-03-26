import { app, BrowserWindow, ipcMain, globalShortcut, shell } from 'electron';
import contextMenu from 'electron-context-menu';
import { electronApp, optimizer } from '@electron-toolkit/utils';
import createScreens, { screens } from './lib/screens';
import mainLogger from './helpers/mainLogger';
import rendererLogger from './helpers/rendererLogger';
import gitClone from './lib/git/gitClone';
import getUsers from './lib/git/getUsers';
import extractLearningOutcomes from './lib/extractLearningOutcomes';
import getOutcomeDetails from './lib/getOutcomeDetails';
import getAllStudentEvidence from './lib/getAllStudentEvidence';
import { readFileSync } from 'fs';
import gitParse from './lib/git/gitParse';
import renderMarkdown from './lib/renderMarkdown';
import fetchRepos from './lib/git/fetchRepos';

import fs from 'fs';
import path from 'path';
import extractLogs from './lib/git/extractLogs';
const dev = !app.isPackaged;

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'; // Disable CSP warnings, this is a local program so we don't need to worry about this

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
  }, 1);
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
    //temporary until i work out how to use the context menu
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  return new Promise((resolve) => {
    // Temporary until i work out why it doesn't wait for users, triggers error in renderer
    //await new Promise((resolve) => setTimeout(resolve, 1000));
    const users = getUsers(data);
    mainLogger.debug(`get-git-users invoked with ${data} and returned ${users.length} users`);
    resolve(users);
  });
});

ipcMain.handle('get-learning-outcomes', async (_event, data: number) => {
  if (typeof data !== 'number') throw new Error('Year must be a number');
  try {
    mainLogger.debug(`get-learning-outcomes invoked with ${data}`);
    const learningOutcomes = await extractLearningOutcomes(data);
    return learningOutcomes;
  } catch (error) {
    mainLogger.error(`get-learning-outcomes invoked with ${data} and returned ${error}`);
    return error;
  }
});

ipcMain.handle('get-outcome-details', async (_event, data) => {
  try {
    mainLogger.debug(`get-outcome-details invoked with ${JSON.stringify(data)}`);
    const outcomeDetails = getOutcomeDetails(data.outcome, data.year);
    return outcomeDetails;
  } catch (e) {
    mainLogger.error(`get-outcome-details invoked with ${data} and returned ${e}`);
    return e;
  }
});

ipcMain.handle('get-evidence', async (_event, data) => {
  try {
    mainLogger.debug(`get-evidence invoked with ${JSON.stringify(data)}`);
    await fetchRepos();
    const evidence = await getAllStudentEvidence(data.repos);
    return evidence;
  } catch (e) {
    mainLogger.error(`get-evidence invoked with ${data} and returned ${e}`);
    return e;
  }
});

ipcMain.on('renderer-log', (_event, data) => {
  rendererLogger[data.level](data.message);
});

ipcMain.on('handle-link', (_event, link: string) => {
  console.log(link);
  shell.openExternal(link);
});

ipcMain.on('pull-repos', async (_event, data) => {
  try {
    mainLogger.debug(`pull-repos invoked with ${data}`);
    await fetchRepos();

    console.log('fetching repos');
    // Read the contents of the directory
    fs.readdir(app.getPath('userData') + '/' + 'repositories', (err, files) => {
      if (err) {
        console.error('Error reading directory:', err);
        return;
      }

      // Iterate through each file/directory
      files.forEach(async (file) => {
        const fullPath = path.join(app.getPath('userData') + '/' + 'repositories', file);

        // Check if it's a directory
        if (fs.statSync(fullPath).isDirectory()) {
          console.log(`Fetching in ${file}...`);
          // Use simple-git to fetch
          extractLogs(fullPath)
          screens.mainWindow.reload();
        }
      });
    });
  } catch (e) {
    mainLogger.error(`pull-repos invoked with ${data} and returned ${e}`);
  }
});

// This will need some serious optimisation, caching files etc as it loads everything on call
ipcMain.handle('load-evidence', (_event, data) => {
  const PUBLIC_REPOSITORIES_FOLDER = app.getPath('userData') + '/' + 'repositories';
  const repoLocation = PUBLIC_REPOSITORIES_FOLDER + '/' + gitParse(data.repo);
  const file = readFileSync(`${repoLocation}/${data.file}`, 'utf-8');
  const render = renderMarkdown(repoLocation, file);
  return render;
});
