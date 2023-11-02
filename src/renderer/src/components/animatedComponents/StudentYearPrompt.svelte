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

  const setStudentYear = (year: number): void => {
    studentInfo.update((obj) => {
      obj.year = year;
      return obj;
    });

    componentTimeline.play();
  };

  $: $animationSpeed,
    ((): void => {
      componentTimeline.timeScale($animationSpeed);
    })();

  onMount(() => {
    componentTimeline.from('#study', {
      autoAlpha: 0,
      duration: 0.5,
      stagger: 1
    });

    componentTimeline.to('#study', {
      y: -50,
      duration: 0.8,
      stagger: 1
    });

    componentTimeline.from('#buttons', {
      autoAlpha: 0,
      duration: 0.5,
      stagger: 1,
      onComplete: () => {
        componentTimeline.pause();
      }
    });

    componentTimeline.to('#buttons', {
      autoAlpha: 0,
      duration: 0.5,
      onReverseComplete: () => {
        componentTimeline.pause();
      }
    });

    componentTimeline.to(
      '#study',
      {
        autoAlpha: 0,
        duration: 0.5
      },
      '-=0.5'
    );
  });
</script>

<h1 class="font-bold text-4xl absolute" id="study">What is your current year of study?</h1>
<div class="flex-row gap-4 absolute pt-3.5 flex" id="buttons">
  <!-- eslint-disable @typescript-eslint/explicit-function-return-type-->
  <!-- https://github.com/sveltejs/svelte/issues/4701 for info about svelte inline TS -->
  <button
    on:click={() => setStudentYear(1)}
    type="button"
    class="xt-button py-2.5 px-3.5 text-sm rounded-md font-medium leading-snug tracking-wider uppercase text-gray-900 bg-gray-100 transition hover:bg-gray-200 active:bg-gray-300 on:bg-gray-200"
  >
    Year One
  </button>

  <button
    on:click={() => setStudentYear(2)}
    type="button"
    class="xt-button py-2.5 px-3.5 text-sm rounded-md font-medium leading-snug tracking-wider uppercase text-gray-900 bg-gray-100 transition hover:bg-gray-200 active:bg-gray-300 on:bg-gray-200"
  >
    Year Two
  </button>

  <button
    on:click={() => setStudentYear(3)}
    type="button"
    class="xt-button py-2.5 px-3.5 text-sm rounded-md font-medium leading-snug tracking-wider uppercase text-gray-900 bg-gray-100 transition hover:bg-gray-200 active:bg-gray-300 on:bg-gray-200"
  >
    Year Three
  </button>

  <button
    on:click={() => setStudentYear(4)}
    type="button"
    class="xt-button py-2.5 px-3.5 text-sm rounded-md font-medium leading-snug tracking-wider uppercase text-gray-900 bg-gray-100 transition hover:bg-gray-200 active:bg-gray-300 on:bg-gray-200"
  >
    Year Four
  </button>
</div>
