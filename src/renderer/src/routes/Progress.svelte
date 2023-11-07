<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { studentInfo, learningOutcomes, studentEvidence } from '$lib/stores/main';
  import gsap from 'gsap';
  import ModuleCard from '$components/ModuleCard.svelte';
  import rendererLogger from '$lib/helpers/logger';

  const getLearningOutcomes = async (year: number): Promise<UHIModule[]> => {
    return await window.electron.ipcRenderer.invoke('get-learning-outcomes', year);
  };

  const getEvidence = async (
    repos: StudentRepos[],
    year: number
  ): Promise<AllModulesCountsObject> => {
    return await window.electron.ipcRenderer.invoke('get-evidence', { repos: repos, year: year });
  };

  const awaitOutcomes = getLearningOutcomes($studentInfo.year).then((outcomes) => {
    learningOutcomes.set(outcomes);
  });

  const awaitEvidence = getEvidence($studentInfo.repositories, $studentInfo.year).then(
    (evidence) => {
      studentEvidence.set(evidence);
    }
  );

  onMount(() => {
    rendererLogger.silly('Progress.svelte mounted');

    gsap.to('#page', {
      autoAlpha: 1,
      duration: 1.5
    });
  });

  onDestroy(() => {
    rendererLogger.silly('Progress.svelte destroyed');
  });
</script>

<!-- eslint-disable @typescript-eslint/explicit-function-return-type-->
<!-- https://github.com/sveltejs/svelte/issues/4701 for info about svelte inline TS -->

<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<div
  id="page"
  class="w-full grid grid-cols-1 lg:grid-cols-2 min-[1530px]:grid-cols-3 overflow-y-scroll pl-4 pr-3 pb-10 min-h-min gap-4 scroll-smooth"
>
  {#await Promise.all([awaitEvidence, awaitOutcomes])}
    <h1>Getting data....</h1>
  {:then}
    {#each $learningOutcomes as module}
      <ModuleCard {module}></ModuleCard>
    {/each}
  {:catch error}
    <h1>Something went wrong</h1>
    <p>{error.message}</p>
  {/await}
</div>

<!-- eslint-enable @typescript-eslint/explicit-function-return-type-->
