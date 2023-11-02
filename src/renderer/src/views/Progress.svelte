<script lang="ts">
  import { studentInfo, learningOutcomes, studentEvidence } from '$lib/stores/main';
  import ModuleCard from '$components/ModuleCard.svelte';
  import rendererLogger from '$lib/helpers/logger';
  import gsap from 'gsap';

  import { onMount, onDestroy } from 'svelte';

  const awaitOutcomes = window.electron.ipcRenderer
    .invoke('get-year-los', $studentInfo.year)
    .then((los) => {
      learningOutcomes.set(los);
    });

  const getEvidence = async (repos: unknown, year: number) => {
    return await window.electron.ipcRenderer
      .invoke('get-evidence', { repos: repos, year: year })
      .then((evidence) => {
        return evidence;
      });
  };

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
<div
  id="page"
  class="w-full grid grid-cols-1 lg:grid-cols-2 min-[1530px]:grid-cols-3 overflow-y-scroll pl-4 pr-3 pb-10 min-h-min gap-4 scroll-smooth"
>
  {#await Promise.all([awaitEvidence, awaitOutcomes])}
    <h1>Getting data....</h1>
  {:then}
    {#each $learningOutcomes.modules as module}
      <ModuleCard {module} evidence={$studentEvidence[module.module]}></ModuleCard>
    {/each}
  {/await}
</div>

<!-- eslint-enable @typescript-eslint/explicit-function-return-type-->
