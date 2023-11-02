//import fs from 'fs';

type EvidenceData = {
  [moduleName: string]: {
    totalWordCount: number;
    wordCountTarget: number;
  } & {
    [outcome: string]: {
      wordCount: number;
      evidenceTypeCounts: {
        reflection: number;
        code: number;
        observation: number;
        pdp: number;
        presentation: number;
      };
    };
  };
};

const evidenceWorth = {
  code: 100,
  observation: 150,
  pdp: 100,
  presentation: 250,
  reflection: 250
};

const moduleWordCounts = [0, 2500, 3000, 3500, 4000];

const getEvidence = async (year, evidence): Promise<EvidenceData> => {
  // Load learning outcomes for the specified year
  const los = await import(`../../../resources/outcomes/year-${year}.json?asset`);
  const evidences: EvidenceData = {};

  // Iterate over modules and outcomes
  los.modules.forEach((modules) => {
    modules.outcomes.forEach((outcomes) => {

      // Filter evidence related to the current outcome
      const filteredEvidence = evidence.filter(
        (evidenceElement) => evidenceElement.outcome === outcomes.outcome
      );

      // Store the filtered evidence in the outcome
      outcomes.evidence = [...filteredEvidence];
    });
  });

  // Populate the evidence data structure
  los.modules.forEach((modules) => {
    evidences[modules.module] = {
      totalWordCount: 0,
      wordCountTarget: moduleWordCounts[year],
      ...modules.outcomes.reduce((acc, outcome) => {
        // Initialize outcome properties
        acc[outcome.outcome] = {
          wordCount: 0,
          evidenceTypeCounts: {
            reflection: 0,
            code: 0,
            observation: 0,
            pdp: 0,
            presentation: 0
          }
        };
        return acc;
      }, {})
    };

    modules.outcomes.forEach((outcomes) => {
      // Initialize outcome properties
      evidences[modules.module][outcomes.outcome] = {
        wordCount: 0,
        evidenceTypeCounts: { reflection: 0, code: 0, observation: 0, pdp: 0, presentation: 0 }
      };

      outcomes.evidence.forEach((evidenceElement) => {
        // Update word count and evidence type counts
        const evidenceValue = evidenceWorth[evidenceElement.evidence];
        evidences[modules.module][outcomes.outcome].wordCount += evidenceValue;
        evidences[modules.module].totalWordCount += evidenceValue;
        evidences[modules.module][outcomes.outcome].evidenceTypeCounts[
          evidenceElement.evidence
        ] += 1;
      });
    });
  });

  return evidences; // Return the evidence data structure
};

export default getEvidence;
