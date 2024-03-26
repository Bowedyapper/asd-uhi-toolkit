const extractLearningOutcomes = async (year: number): Promise<CourseModule> => {
  const learningOutcomes = (await import(`../../../resources/outcomes/year-${year}.json`)).modules;

  const outcomesMap = learningOutcomes.map(
    (item: CourseModule): CourseModule => ({
      module: item.module,
      outcomes: item.outcomes.map((outcome: DetailedOutcome) => outcome.outcome)
    })
  );
  return outcomesMap;
};

export default extractLearningOutcomes;
