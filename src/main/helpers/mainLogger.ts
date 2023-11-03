import log, { MainLogger, Logger } from 'electron-log';
import { app } from 'electron';
const mainLog: MainLogger = log.create({ logId: 'mainLogger' }) as Logger & MainLogger;
const dev = !app.isPackaged;

mainLog.initialize({ preload: true });
mainLog.transports.console.format = '[electron][{level}][{d}-{m}-{y}:{h}:{i}]:{text}';
mainLog.transports.console.useStyles = true;
mainLog.transports.file.format = '[electron][{level}][{d}-{m}-{y}:{h}:{i}]:{text}';
mainLog.transports.file.maxSize = 1048576;
mainLog.transports.file.level = dev ? 'silly' : 'info';

export default mainLog;
