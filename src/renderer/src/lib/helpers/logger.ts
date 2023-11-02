const rendererLogger = {
  debug: (message: string): void => {
    window.electron.ipcRenderer.send('renderer-log', { message: message, level: 'debug' });
  },
  info: (message: string): void => {
    window.electron.ipcRenderer.send('renderer-log', { message: message, level: 'info' });
  },
  warn: (message: string): void => {
    window.electron.ipcRenderer.send('renderer-log', { message: message, level: 'warn' });
  },
  error: (message: string): void => {
    window.electron.ipcRenderer.send('renderer-log', { message: message, level: 'error' });
  },
  silly: (message: string): void => {
    window.electron.ipcRenderer.send('renderer-log', { message: message, level: 'silly' });
  },
  verbose: (message: string): void => {
    window.electron.ipcRenderer.send('renderer-log', { message: message, level: 'verbose' });
  }
};

export default rendererLogger;
