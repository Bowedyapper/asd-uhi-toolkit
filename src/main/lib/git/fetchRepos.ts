import fs from 'fs';
import path from 'path';
import { app } from 'electron';
import git from './git';

const PUBLIC_REPOSITORIES_FOLDER = app.getPath('userData') + '/' + 'repositories';

const fetchRepos = async (): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    console.log('fetching repos');
    // Read the contents of the directory
    fs.readdir(PUBLIC_REPOSITORIES_FOLDER, (err, files) => {
      if (err) {
        console.error('Error reading directory:', err);
        return;
      }

      // Iterate through each file/directory
      files.forEach(async (file) => {
        const fullPath = path.join(PUBLIC_REPOSITORIES_FOLDER, file);

        // Check if it's a directory
        if (fs.statSync(fullPath).isDirectory()) {
          console.log(`Fetching in ${file}...`);
          git.cwd(fullPath);
          // Use simple-git to fetch
          await git.pull((err, result) => {
            if (err) {
              console.error(`Error fetching in ${file}:`, err);
              reject();
            } else {
              console.log(`Fetch result in ${file}:`, result);
              resolve();
            }
          });
        }
      });
    });
  });
};

export default fetchRepos;
