import { app } from 'electron';
const PUBLIC_REPOSITORIES_FOLDER = app.getPath('userData') + '/' + 'repositories';
import git from './git';
import folderExists from '../folderExists';
import extractLogs from './extractLogs';
import mainLogger from '../../helpers/mainLogger';

import gitParse from './gitParse';

const gitClone = async (repo: string): Promise<void> => {
  const repoName = gitParse(repo);
  mainLogger.info(`Attempting to clone ${repo} to ${PUBLIC_REPOSITORIES_FOLDER}/${repoName}`);

  await new Promise<void>((resolve, reject) => {
    if (!folderExists(`${PUBLIC_REPOSITORIES_FOLDER}/${repoName}`)) {
      try {
        git.clone(
          repo,
          `${PUBLIC_REPOSITORIES_FOLDER}/${repoName}`,
          {},
          (err: unknown, res: unknown) => {
            console.log('\x1b[34m' + res + '\x1b[0m');
            if (err) {
              reject(err);
              mainLogger.error(
                `Error cloning ${repo} to ${PUBLIC_REPOSITORIES_FOLDER}/${repoName}`
              );
            } else {
              mainLogger.info(
                `Success cloning ${repo} to ${PUBLIC_REPOSITORIES_FOLDER}/${repoName}`
              );
              extractLogs(repoName);
              resolve();
            }
          }
        );
      } catch (err) {
        reject(err);
        mainLogger.error(`Error cloning ${repo} to ${PUBLIC_REPOSITORIES_FOLDER}/${repoName}`);
      }
    } else {
      // // This is temporary for testing
      // fs.rmSync(`${PUBLIC_REPOSITORIES_FOLDER}/${repoName}`, { recursive: true, force: true });
      // console.log(`\x1b[34m[gitCLone]\x1b[0m Removed ${PUBLIC_REPOSITORIES_FOLDER}/${repoName}`)
      // simpleGit().clone(repo, `${PUBLIC_REPOSITORIES_FOLDER}/${repoName}`, {}, (err: any, res: any) => {
      //     if (err) {
      //         reject(err)
      //         console.log(`\x1b[34m[gitCLone]\x1b[0m Error cloning ${repo} to ${PUBLIC_REPOSITORIES_FOLDER}/${repoName}`)
      //     } else {
      //         resolve(res)
      //         console.log(`\x1b[34m[gitCLone]\x1b[0m Success cloning ${repo} to ${PUBLIC_REPOSITORIES_FOLDER}/${repoName}`)
      extractLogs(repoName);
      mainLogger.info(`${repoName} already exists, skipping clone`);
      resolve();
      //}
      //});
    }
  });
};

export default gitClone;
