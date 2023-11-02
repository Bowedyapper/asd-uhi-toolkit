<script lang="ts">
  import gsap from 'gsap';
  import { onMount } from 'svelte';
  import { animationSpeed, studentInfo } from '$lib/stores/main';

  export let onAnimComplete: () => void = () => {};
  export let onAnimReverseComplete: () => void = () => {};

  export const componentTimeline = gsap.timeline({
    onComplete: onAnimComplete,
    onReverseComplete: onAnimReverseComplete
  });

  const setVisibility = (): void => {
    if ($studentInfo.repositories.length > 0) {
      componentTimeline.play();
    } else {
      componentTimeline.reverse();
    }
  };
  $: $studentInfo.repositories, setVisibility();

  $: $animationSpeed,
    ((): void => {
      componentTimeline.timeScale($animationSpeed);
    })();

  onMount(() => {
    setVisibility();
    componentTimeline.from('#repo-list', {
      autoAlpha: 0,
      duration: 0.5,
      onComplete: () => {
        componentTimeline.pause();
      },
      onReverseComplete: () => {
        componentTimeline.pause();
      }
    });
  });
</script>

<!-- eslint-disable @typescript-eslint/explicit-function-return-type-->
<!-- https://github.com/sveltejs/svelte/issues/4701 for info about svelte inline TS -->

<div id="repo-list" class="absolute top-24 left-7 w-96">
  <div
    class="flex flex-col xt-card rounded-lg text-white text-sm xt-links-default bg-gray-800 max-h-32 max-w-md min-h-[5rem] pt-2"
  >
    <div class="sticky flex flex-row justify-evenly pl-2 pr-4">
      <div>Repository</div>
      <div class="ml-auto">Remove</div>
    </div>
    <div class="overflow-y-scroll pt-1 pl-2 pb-2">
      {#each $studentInfo.repositories as repo, index}
        <div
          class="overflow-y-scroll flex flex-row align-middle items-center mr-2 mt-2 mb-2 max-h-32"
        >
          {repo.url}
          <button
            on:click={() => {
              studentInfo.update((student) => ({
                ...student,
                repositories: student.repositories.filter((r) => r.url !== repo.url)
              }));
            }}
            type="button"
            class="ml-auto xt-button px-1 max-h-5 text-sm rounded-md font-medium leading-snug tracking-wider uppercase text-white bg-gray-700 transition hover:bg-gray-500 active:bg-gray-300 on:bg-gray-200"
          >
            X
          </button>
        </div>
        {#if index < $studentInfo.repositories.length - 1}<hr
            class=" h-0.5 mx-auto bg-gray-100 border-0 rounded dark:bg-gray-600"
          />{/if}
      {/each}
    </div>
  </div>
</div>
