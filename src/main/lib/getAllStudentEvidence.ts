import extractEvidenceCommits from './extractEvidenceCommits';

const getAllStudentEvidence = (data: StudentRepos[]): Evidence[] => {
  const evidenceData: Evidence[] = [];
  data.forEach((repo: StudentRepos) => {
    const evidence: Evidence[] = extractEvidenceCommits(repo.url, repo.user);
    evidenceData.push(...evidence);
  });
  return evidenceData.concat();
};

export default getAllStudentEvidence;
