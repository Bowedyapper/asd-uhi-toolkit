import gitUrlParse from 'git-url-parse';

const constructCommitURI = (repoUri: string, commitHash: string): string => {
  const parsed = gitUrlParse(repoUri);
  return `https://${parsed.source}/${parsed.owner}/${parsed.name}/-/commit/${commitHash}`;
};

export default constructCommitURI;
