import { app } from 'electron';
import gitParse from './gitParse';
const PUBLIC_REPOSITORIES_LOGS = app.getPath('userData') + '/' + 'repositories_logs';
import fs from 'fs';

const extractEvidenceCommits = async (
  repoPath: string,
  user: string
): Promise<{ outcome: string; evidence: string }[]> => {
  const learningOutcomes: { outcome: string; evidence: string }[] = [];
  const gitLog = await fs.readFileSync(`${PUBLIC_REPOSITORIES_LOGS}/${gitParse(repoPath)}.json`);

  const loRegex = /lo:?\s*\d.\d.\d.\d\s*:\s*.*/i;

  JSON.parse(gitLog.toString())
    .filter((entry) => loRegex.test(entry.message))
    .filter((entry) => entry.author_name === user)
    .forEach((element) => {
      const m = element.message.matchAll(/(\d+\.\d+\.\d+\.\d+):(\w+)/g);
      const s = Array.from(m, (match: RegExpMatchArray) => ({
        outcome: match[1],
        evidence: match[2],
        hash: element.hash,
        gitURI: repoPath
      }));
      s.forEach((element) => {
        learningOutcomes.push(element);
      });
    });

  return learningOutcomes;
};

export default extractEvidenceCommits;
