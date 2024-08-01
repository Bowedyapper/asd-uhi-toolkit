import { contextBridge } from 'electron';
import { ElectronAPI, electronAPI } from '@electron-toolkit/preload';

declare global {
  interface Window {
    electron: ElectronAPI;
    api: unknown;
  }
}

window.electron = window.electron || {};

// Custom APIs for renderer
const api = {};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = electronAPI;
  window.api = api;
}

// We dont want links opening inside electron, so this will delegate them to the default browser
document.onclick = function (event) {
  const target = event.target as HTMLElement;
  const href = target.getAttribute('href');
  if (target.tagName === 'A' && href && href.startsWith('http')) {
    event.preventDefault();
    electronAPI.ipcRenderer.send('handle-link', href);
  }
};
