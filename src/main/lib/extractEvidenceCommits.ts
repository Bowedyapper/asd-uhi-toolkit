import { app } from 'electron';
import gitParse from './git/gitParse';
const PUBLIC_REPOSITORIES_LOGS = app.getPath('userData') + '/' + 'repositories_logs';
import fs from 'fs';
import constructCommitURI from './git/constructCommitURI';
import mainLogger from '../helpers/mainLogger';

const extractEvidenceCommits = (repoPath: string, user: string): Evidence[] => {
  try {
    const evidence: Evidence[] = [];
    const gitLog = fs.readFileSync(`${PUBLIC_REPOSITORIES_LOGS}/${gitParse(repoPath)}.json`);

    const loRegex = /lo:?\s*\d.\d.\d.\d\s*:\s*.*/i;

    JSON.parse(gitLog.toString())
      .filter((entry: GitLogResult) => loRegex.test(entry.message))
      .filter((entry: GitLogResult) => entry.author_name === user)
      .forEach((element: GitLogResult) => {
        const m = element.message.matchAll(/(\d+\.\d+\.\d+\.\d+):(\w+)/gim);
        const s = Array.from(m, (match: RegExpMatchArray) => ({
          outcome: match[1],
          evidenceType: match[2].charAt(0).toUpperCase() + match[2].slice(1),
          hash: element.hash,
          gitURI: repoPath,
          commitURI: constructCommitURI(repoPath, element.hash),
          date: element.date,
          files: element.diff
        }));
        s.forEach((element) => {
          evidence.push(element);
        });
      });

    return evidence;
  } catch (err) {
    mainLogger.error(err);
    return [];
  }
};

export default extractEvidenceCommits;
