import { readFileSync } from 'fs';

const getOutcomeDetails = async (outcome: string, year: number): Promise<DetailedOutcome> => {
  const learningOutcomes = JSON.parse(
    readFileSync(`./resources/outcomes/year-${year}.json`, 'utf-8')
  ).modules;

  const outcomeDetails: CourseModule[] = learningOutcomes.filter((module) =>
    module.outcomes.find((outcomeArray: DetailedOutcome) => outcomeArray.outcome === outcome)
  );

  const foundOutcome: DetailedOutcome[] = outcomeDetails[0].outcomes.filter(
    (outcomeArray) => outcomeArray.outcome === outcome
  );

  return foundOutcome[0];
};

export default getOutcomeDetails;
