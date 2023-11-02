import { ElectronAPI } from '@electron-toolkit/preload';

declare global {
  interface Window extends Window {
    electron: ElectronAPI;
  }
  interface StudentInfo {
    year: string;
    repositories: object[];
  }
}

window.electron = window.electron || {};
