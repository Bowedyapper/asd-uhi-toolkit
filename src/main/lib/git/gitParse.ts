import gitUrlParse from 'git-url-parse';

const gitParse = (repoUri: string): string => {
  const parsed = gitUrlParse(repoUri);
  return `${parsed.source}_${parsed.owner}_${parsed.name}`;
};

export default gitParse;

/*
{
  protocols: [ 'ssh' ],
  protocol: 'ssh',
  port: '',
  resource: 'gitlab.com',
  host: 'gitlab.com',
  user: 'git',
  password: '',
  pathname: '/UHI-BScH-ASD/year-2.git',
  hash: '',
  search: '',
  href: 'git@gitlab.com:UHI-BScH-ASD/year-2.git',
  query: {},
  parse_failed: false,
  token: '',
  toString: [Function (anonymous)],
  source: 'gitlab.com',
  git_suffix: true,
  name: 'year-2',
  owner: 'UHI-BScH-ASD',
  commit: undefined,
  ref: '',
  filepathtype: '',
  filepath: '',
  organization: 'UHI-BScH-ASD',
  full_name: 'UHI-BScH-ASD/year-2'
}
*/
