import { app } from 'electron';
const PUBLIC_REPOSITORIES_LOGS = app.getPath('userData') + '/' + 'repositories_logs';
const PUBLIC_REPOSITORIES_FOLDER = app.getPath('userData') + '/' + 'repositories';
import fs from 'fs';
import git from './git';

// This will need some checking to see if a file similar exists and rename accordingly, or perhaps rewrite the git cloning to include git parent tree stub as well in the foldername
const extractLogs = (repoDir: string): void => {
  if (!fs.existsSync(PUBLIC_REPOSITORIES_LOGS)) {
    // If it doesn't exist, create it
    fs.mkdirSync(PUBLIC_REPOSITORIES_LOGS);
  }
  // Change the working directory to the path of your Git repository
  git.cwd(`${PUBLIC_REPOSITORIES_FOLDER}/${repoDir}`);

  // Get the full commit log

  //disable ts warning
  // @ts-ignore no idea what the bottom param types are
  git.log((err, log) => {
    if (err) {
      console.error(err);
    } else {
      fs.writeFile(
        `${PUBLIC_REPOSITORIES_LOGS}/${repoDir}.json`,
        JSON.stringify(log.all),
        (err) => {
          console.log(err);
        }
      );
    }
  });
};

export default extractLogs;
