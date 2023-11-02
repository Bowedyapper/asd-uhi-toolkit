import { app } from 'electron';
import log, { MainLogger, Logger } from 'electron-log';
const rendererLog: MainLogger = log.create({ logId: 'rendererLog' }) as Logger & MainLogger;
const dev = !app.isPackaged;

rendererLog.initialize({ preload: true });
rendererLog.transports.console.format = '[renderer][{level}][{d}-{m}-{y}:{h}:{i}]:{text}';
rendererLog.transports.console.useStyles = true;
rendererLog.transports.file.format = '[renderer][{level}][{d}-{m}-{y}:{h}:{i}]:{text}';
rendererLog.transports.file.maxSize = 1048576;
rendererLog.transports.file.level = dev ? 'silly' : 'info';

export default rendererLog;
