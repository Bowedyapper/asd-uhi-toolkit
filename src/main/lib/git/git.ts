import simpleGit, { SimpleGitProgressEvent } from 'simple-git';
import { screens } from '../screens';
import mainLogger from '../../helpers/mainLogger';

const progress = ({ method, stage, progress }: SimpleGitProgressEvent) => {
  mainLogger.info(`git progress: ${method} ${stage} ${progress}%`);
  screens.mainWindow.webContents.send('git-progress', { method, stage, progress });
};

const git = simpleGit({ progress });

export default git;
