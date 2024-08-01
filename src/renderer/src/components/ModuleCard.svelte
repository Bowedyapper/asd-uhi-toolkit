<script lang="ts">
  import moment from 'moment';
  import mediumZoom from 'medium-zoom';
  mediumZoom('.medium-zoom');
  import ProgressBar from './ProgressBar.svelte';

  import { studentInfo, studentEvidence } from '$lib/stores/main';

  export let module: CourseModule;

  const evidenceWorth: { [evidenceType: string]: number } = {
    Code: 100,
    Observation: 150,
    PDP: 100,
    Presentation: 250,
    Reflection: 250
  };

  const moduleWordCountTargets: number[] = [0, 2500, 3000, 3500, 4000];

  const outcomeTypeColours: { [key: string]: string } = {
    Agile: 'bg-pink-700',
    Business: 'bg-blue-700',
    Employability: 'bg-yellow-700',
    Security: 'bg-red-700',
    Technical: 'bg-green-700'
  };

  const getBgColour = (percentage: number): string => {
    if (percentage < 25) {
      return `text-red-700`;
    } else if (percentage < 50) {
      return 'text-yellow-700';
    } else if (percentage < 85) {
      return 'text-green-700';
    } else {
      return 'text-blue-700';
    }
  };

  const getBgColour2 = (percentage: number): string => {
    if (percentage < 5) {
      return 'bg-red-800';
    } else if (percentage < 10) {
      return 'bg-orange-800';
    } else if (percentage < 15) {
      return 'bg-yellow-800';
    } else if (percentage <= 24) {
      return 'bg-green-800';
    } else if (percentage <= 28) {
      return 'bg-yellow-800';
    } else if (percentage <= 34) {
      return 'bg-orange-800';
    } else {
      return 'bg-red-800';
    }
  };

  const getLearningOutcomeDetails = async (
    year: number,
    outcome: string
  ): Promise<DetailedOutcome[]> => {
    return await window.electron.ipcRenderer.invoke('get-outcome-details', {
      year: year,
      outcome: outcome
    });
  };

  const getEvidenceForOutcome = (outcome: string): Evidence[] => {
    return $studentEvidence.filter((evidence) => evidence.outcome === outcome);
  };

  const calculateWordCounts = (): CalculatedWordCounts => {
    const moduleWordCount: CalculatedWordCounts = { total: 0, outcomes: {} };
    module.outcomes.forEach((outcome: Outcome) => {
      moduleWordCount.outcomes[outcome as string] = {
        total: 0,
        evidenceTypeCounts: {
          Reflection: 0,
          Code: 0,
          PDP: 0,
          Presentation: 0,
          Observation: 0
        }
      };

      const evidenceMatchedtoModule = $studentEvidence.filter(
        (evidence) => outcome === evidence.outcome
      );

      evidenceMatchedtoModule.forEach((evidence) => {
        const { evidenceType } = evidence;
        const { outcomes } = moduleWordCount;
        const outcomeData = outcomes[outcome as string];

        moduleWordCount.total += evidenceWorth[evidenceType];
        outcomeData.total += evidenceWorth[evidenceType];
        outcomeData.evidenceTypeCounts[evidenceType as keyof EvidenceTypeCounts] += 1;
      });
    });

    return moduleWordCount;
  };

  const moduleWordCounts = calculateWordCounts();

  const moduleCompletePercentage = Math.round(
    (moduleWordCounts.total / moduleWordCountTargets[$studentInfo.year]) * 100
  );

  const openOutcomeDetailsModal = (outcome: string): void => {
    const getModal = document.getElementById(`${outcome}_modal`) as HTMLDialogElement;
    getModal.showModal();
  };

  const loadEvidence = async (repo: string, file: string): Promise<Evidence[]> => {
    return window.electron.ipcRenderer.invoke('load-evidence', {
      repo: repo,
      file: file
    });
  };
</script>

<div class="card bg-base-100 shadow-xl">
  <div class="flex pt-2 pr-7 justify-between items-center">
    <h2 class="card-title ml-5 h-10 text-gray-300 flex-1">{module.module}</h2>
    <div class="mx-8">
      <ProgressBar value={moduleWordCounts.total} max={moduleWordCountTargets[$studentInfo.year]}
      ></ProgressBar>
    </div>
    <div
      style="--value:{moduleCompletePercentage}; --size:4rem; --thickness:8px;"
      class="{getBgColour(
        moduleCompletePercentage
      )} radial-progress text-sm text-center bg-base-300 subpixel-antialiased"
    >
      {moduleCompletePercentage}%
    </div>
  </div>
  <div class="card-body p-3 text-gray-200">
    {#each module.outcomes as outcome}
      {#await getLearningOutcomeDetails($studentInfo.year, outcome)}
        <div class="collapse bg-base-200 rounded-md">
          <div class="flex collapse-title justify-center">
            <div class="loading loading-bars loading-sm"></div>
          </div>
        </div>
      {:then outcomeDetails}
        <div class="collapse bg-base-200 rounded-md">
          <input type="checkbox" />
          <div class="flex justify-between collapse-title text-xl font-medium items-center">
            <div class="absolute h-full w-1.5 -ml-4 {outcomeTypeColours[outcomeDetails.type]}" />
            <div class="w-12 text-sm">{outcomeDetails.type}</div>
            <div class="text-md">LO: {outcome}</div>
            <div
              role="button"
              tabindex="0"
              on:keyup={(e) => {
                if (e.key == 'Enter') {
                  openOutcomeDetailsModal(outcome);
                }
              }}
              on:click={() => openOutcomeDetailsModal(outcome)}
              class="{getBgColour2(
                Math.round(
                  (moduleWordCounts.outcomes[outcome].total / moduleWordCounts.total) * 100
                )
              )} p-2 rounded-md h-10 w-12 text-center text-sm -mr-8 z-30 hover:brightness-125 tooltip tooltip-left"
              data-tip="See evidence"
            >
              {#if moduleWordCounts.total > 0}
                {Math.round(
                  (moduleWordCounts.outcomes[outcome].total / moduleWordCounts.total) * 100
                )}%
              {:else}
                0%
              {/if}
            </div>
          </div>
          <div class="collapse-content">
            <div class="absolute h-full w-1.5 -ml-4 {outcomeTypeColours[outcomeDetails.type]}" />
            <p>{outcomeDetails.descriptor}</p>
          </div>
        </div>
      {/await}
      <dialog id="{outcome}_modal" class="modal">
        <div class="modal-box w-11/12 max-w-3xl">
          <form method="dialog" class="modal-backdrop">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-50 text-white"
              >✕</button
            >
          </form>
          <h3 class="font-bold text-lg">Evidence for LO:{outcome}</h3>
          <div class="divider -mt-1"></div>
          {#if moduleWordCounts.outcomes[outcome].total === 0}
            <p class="text-2xl">No evidence found for this learning outcome</p>
          {:else}
            <table class="table table-fixed mb-4 text-center">
              <thead>
                <tr>
                  <th>Reflections</th>
                  <th>Code</th>
                  <th>PDP's</th>
                  <th>Presentations</th>
                  <th>Observations</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="text-4xl font-bold"
                    >{moduleWordCounts.outcomes[outcome].evidenceTypeCounts.Reflection}</td
                  >
                  <td class="text-4xl font-bold"
                    >{moduleWordCounts.outcomes[outcome].evidenceTypeCounts.Code}</td
                  >
                  <td class="text-4xl font-bold"
                    >{moduleWordCounts.outcomes[outcome].evidenceTypeCounts.PDP}</td
                  >
                  <td class="text-4xl font-bold"
                    >{moduleWordCounts.outcomes[outcome].evidenceTypeCounts.Presentation}</td
                  >
                  <td class="text-4xl font-bold"
                    >{moduleWordCounts.outcomes[outcome].evidenceTypeCounts.Observation}</td
                  >
                </tr>
              </tbody>
            </table>
            <div class="flex flex-col">
              <div class="overflow-x-auto shadow-md sm:rounded-lg">
                <div class="inline-block min-w-full align-middle">
                  <div class="overflow-hidden">
                    <table
                      class="min-w-full divide-y divide-base-200 table-fixed dark:divide-gray-700"
                    >
                      <thead class="bg-base-100 dark:bg-base-200">
                        <tr>
                          <th
                            scope="col"
                            class="py-3 px-6 text-xs font-medium tracking-wider text-left text-base-100 uppercase dark:text-gray-400"
                          >
                            File Name
                          </th>
                          <th
                            scope="col"
                            class="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                          >
                            Evidence Type
                          </th>
                          <th
                            scope="col"
                            class="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                          >
                            Date Committed
                          </th>
                          <th scope="col" class="p-1">
                            <span class="sr-only">Commit URL</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody
                        class="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700"
                      >
                        {#each getEvidenceForOutcome(outcome) as smd}
                          {#each smd.files.files as file}
                            <tr
                              role="button"
                              tabindex="0"
                              on:keyup={(e) => {
                                if (e.key == 'Enter') {
                                  document.getElementById(file.file + '_modal').showModal();
                                }
                              }}
                              on:click={() => {
                                document.getElementById(file.file + '_modal').showModal();
                              }}
                            >
                              <td
                                class="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                >{file.file.replace(/.*\//, '')}</td
                              >
                              <td
                                class="tooltip py-4 px-6 text-sm font-medium text-gray-500 whitespace-nowrap dark:text-white"
                                data-tip={`Worth ${evidenceWorth[smd.evidenceType]} words`}
                                >{smd.evidenceType}</td
                              >
                              <td
                                class="tooltip py-4 -px-1 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                data-tip={moment(smd.date).fromNow()}
                                >{moment(smd.date).local().format('DD-MM-YYYY HH:mm')}</td
                              >
                              <td
                                class="py-4 px-6 text-sm font-medium text-right whitespace-nowrap"
                              >
                                <a href="#" class="text-blue-600 dark:text-blue-500 hover:underline"
                                  ><svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    class="w-6 h-6"
                                  >
                                    <path
                                      d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                                    />
                                  </svg></a
                                >
                              </td>
                            </tr>
                            <dialog id="{file.file}_modal" class="modal z-50 no-drag">
                              <div class="modal-box w-full max-w-4xl flex flex-col items-center">
                                <form method="dialog" class="modal-backdrop z-50">
                                  <button
                                    class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-50 text-white"
                                    >✕</button
                                  >
                                </form>
                                <h3 class="font-bold text-lg">{file.file.replace(/.*\//, '')}</h3>
                                {#if null}
                                  <!-- Disabled the loading of files for now, its making everything slow, needs to be lazy loaded-->
                                  <div class="prose overflow-y-scroll w-full max-w-full text-white">
                                    {#await loadEvidence(smd.gitURI, file.file)}
                                      <p>Loading file....</p>
                                    {:then fileData}
                                      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                                      {@html fileData}
                                    {/await}
                                  </div>
                                {/if}
                              </div>
                            </dialog>
                          {/each}
                        {/each}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          {/if}
        </div>
      </dialog>
    {/each}
    <!-- <div class="card-actions justify-end"></div> -->
  </div>
</div>
