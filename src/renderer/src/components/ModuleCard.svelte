<script lang="ts">
  import ProgressBar from './ProgressBar.svelte';

  export let module;
  export let evidence;

  const outcomeTypeColours = {
    agile: 'bg-pink-700',
    business: 'bg-blue-700',
    employability: 'bg-yellow-700',
    security: 'bg-red-700',
    technical: 'bg-green-700'
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

  const moduleCompletePercentage = Math.round(
    (evidence.totalWordCount / evidence.wordCountTarget) * 100
  );
</script>

<div class="card bg-base-100 shadow-xl">
  <div class="flex pt-2 pr-7 justify-between items-center">
    <h2 class="card-title ml-5 text-gray-300 flex-1">{module.module}</h2>
    <div class="mx-8">
      <ProgressBar value={evidence.totalWordCount} max={evidence.wordCountTarget}></ProgressBar>
    </div>
    <div
      style="--value:{moduleCompletePercentage}; --size:3rem; --thickness:5px;"
      class="{getBgColour(
        moduleCompletePercentage
      )} radial-progress text-sm text-center bg-base-300 antialiased"
    >
      {moduleCompletePercentage}%
    </div>
  </div>
  <div class="card-body p-3 text-gray-200">
    {#each module.outcomes as outcome}
      <div class="collapse bg-base-200 rounded-md">
        <input type="checkbox" />
        <div class="flex justify-between collapse-title text-xl font-medium items-center">
          <div
            class="absolute h-full w-1.5 -ml-4 {outcomeTypeColours[outcome.type.toLowerCase()]}"
          />
          <div class="w-12 text-sm">{outcome.type}</div>
          <div class="text-md">LO: {outcome.outcome}</div>
          <div
            class="{getBgColour2(
              Math.round((evidence[outcome.outcome].wordCount / evidence.totalWordCount) * 100)
            )} p-2 rounded-md h-10 w-12 text-center text-sm -mr-8"
          >
            {#if evidence.totalWordCount > 0}
              {Math.round((evidence[outcome.outcome].wordCount / evidence.totalWordCount) * 100)}%
            {:else}
              0%
            {/if}
          </div>
        </div>
        <div class="collapse-content">
          <div
            class="absolute h-full w-1.5 -ml-4 {outcomeTypeColours[outcome.type.toLowerCase()]}"
          />
          <p>{outcome.descriptor}</p>
          <div class="absolute bottom-0 flex w-full justify-evenly">
        <div>Reflections: {evidence[outcome.outcome].evidenceTypeCounts.reflection}</div>
        <div>Code: {evidence[outcome.outcome].evidenceTypeCounts.code}</div>
        <div>PDPs: {evidence[outcome.outcome].evidenceTypeCounts.pdp}</div>
        <div>Presentations: {evidence[outcome.outcome].evidenceTypeCounts.presentation}</div>
        <div>Observations: {evidence[outcome.outcome].evidenceTypeCounts.observation}</div>
      </div>
        </div>
      </div>
    {/each}
    <!-- <div class="card-actions justify-end">
      <button class="btn btn-primary">Buy Now</button>
    </div> -->
  </div>
</div>
