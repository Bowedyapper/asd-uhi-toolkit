import { ElectronAPI } from '@electron-toolkit/preload';

declare global {
  interface Window extends Window {
    electron: ElectronAPI;
  }
}

window.electron = window.electron || {};
