<script lang="ts">
  import AppIntroText from '$components/animatedComponents/AppIntroText.svelte';
  import StudentYearPrompt from '$components/animatedComponents/StudentYearPrompt.svelte';
  import StudentYearText from '$components/animatedComponents/StudentYearText.svelte';
  import AddRepo from '$components/animatedComponents/AddRepo.svelte';

  import StudentRepoList from '$components/animatedComponents/StudentRepoList.svelte';
  import { onDestroy, onMount } from 'svelte';
  import rendererLogger from '$lib/helpers/logger';

  const page = new URLSearchParams(window.location.search);
  let studentYearTextTimeline: GSAPTimeline;
  let scene: number = 1;
  let lastTimeline: GSAPTimeline;
  onMount(() => {
    rendererLogger.silly('Setup.svelte mounted');
  });

  onDestroy(() => {
    rendererLogger.silly('Setup.svelte destroyed');
  });

  if (page.has('end')) {
    setTimeout(() => {
      scene = 3;
      lastTimeline.reverse(0);
    }, 1);
  }
</script>

<!-- eslint-disable @typescript-eslint/explicit-function-return-type-->
<!-- https://github.com/sveltejs/svelte/issues/4701 for info about svelte inline TS -->
{#if scene > 2}<StudentRepoList></StudentRepoList>{/if}
<StudentYearText bind:componentTimeline={studentYearTextTimeline}></StudentYearText>
{#if scene === 1}
  <AppIntroText onAnimComplete={() => (scene = 2)}></AppIntroText>
{:else if scene === 2}
  <StudentYearPrompt
    onAnimComplete={() => {
      studentYearTextTimeline.play();
      setTimeout(() => {
        scene = 3;
      }, studentYearTextTimeline.duration() * 1000);
    }}
  ></StudentYearPrompt>
{:else if scene === 3}
  <AddRepo bind:componentTimeline={lastTimeline}></AddRepo>
{/if}

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
      'Open Sans', 'Helvetica Neue', sans-serif;
  }
</style>
