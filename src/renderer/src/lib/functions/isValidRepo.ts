const isValidRepo = (repoUri: string): boolean => {
  const gitRegex = /((git|ssh|http(s)?)|(git@[\w.]+))(:(\/\/)?)([\w.@:/\-~]+)(\.git)(\/)?/gm;
  gitRegex.lastIndex = 0;
  return gitRegex.test(repoUri);
};

export default isValidRepo;
