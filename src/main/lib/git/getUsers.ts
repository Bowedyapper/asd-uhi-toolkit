import fs from 'fs';
import { app } from 'electron';
import gitParse from './gitParse';
const PUBLIC_REPOSITORIES_LOGS = app.getPath('userData') + '/' + 'repositories_logs';

interface Author {
  author_name: string;
  author_email: string;
}

const getUsers = (repoLog: string): Author[] => {
  const repoName = gitParse(repoLog);
  const jsonData = JSON.parse(
    fs.readFileSync(PUBLIC_REPOSITORIES_LOGS + '/' + repoName + '.json', 'utf8')
  );
  const uniqueAuthors: Record<string, Author> = {};

  jsonData.forEach((item: Record<string, string>) => {
    const { author_name, author_email } = item;
    if (!uniqueAuthors[author_email]) {
      uniqueAuthors[author_email] = { author_name, author_email };
    }
  });

  const resultArray = Object.values(uniqueAuthors);
  return resultArray;
};

export default getUsers;
