interface StudentRepos {
  url: string;
  user: string;
}

interface StudentInfo {
  year: number;
  repositories: StudentRepos[];
}

interface DetailedOutcome {
  outcome: string;
  type?: 'Reflection' | 'Code' | 'Observation' | 'PDP' | 'Presentation';
  descriptor?: string;
  explanation?: string;
  evidence?: Evidence[];
}

type Outcome = string | DetailedOutcome;

interface CourseModule {
  module: string;
  outcomes: Outcome[];
}

interface OutcomeJSONFile {
  modules: {
    module: string;
    outcomes: DetailedOutcome[];
  }[];
}

interface GitDiff {
  changed: number;
  deletions: number;
  insertions: number;
  files: {
    file: string;
    changes: number;
    insertions: number;
    deletions: number;
    binary: boolean;
  }[];
}

interface GitLogResult {
  hash: string;
  date: string;
  message: string;
  refs: string;
  body: string;
  author_name: string;
  author_email: string;
  diff: GitDiff;
}

interface Evidence {
  outcome: string;
  evidenceType: string;
  hash: string;
  gitURI: string;
  commitURI: string;
  date: string;
  files: GitDiff;
}

interface EvidenceTypeCounts {
  Reflection: number;
  Code: number;
  Observation: number;
  PDP: number;
  Presentation: number;
}

interface CalculatedWordCounts {
  total: number;
  outcomes: {
    [outcome: string]: {
      total: number;
      evidenceTypeCounts: EvidenceTypeCounts;
    };
  };
}

interface OutcomeWordCount {
  wordCount: number;
  evidenceTypeCounts: EvidenceTypeCounts;
}

interface ModuleWordCount {
  totalWordCount: number;
  wordCountTarget: number;
  [outcome: string]: OutcomeWordCount;
}

interface AllModulesCountsObject {
  [module: string]: ModuleWordCount;
}

interface GitUserList {
  author_name: string;
  author_email: string;
}
