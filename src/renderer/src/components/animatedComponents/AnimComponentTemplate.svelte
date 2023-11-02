<script lang="ts">
  import gsap from 'gsap';
  import { onMount } from 'svelte';
  import { animationSpeed } from '$lib/stores/main';

  export let onAnimComplete: () => void = () => {};
  export let onAnimReverseComplete: () => void = () => {};

  export const componentTimeline = gsap.timeline({
    onComplete: onAnimComplete,
    onReverseComplete: onAnimReverseComplete
  });

  $: $animationSpeed,
    ((): void => {
      componentTimeline.timeScale($animationSpeed);
    })();

  onMount(() => {});
</script>

<!-- eslint-disable @typescript-eslint/explicit-function-return-type-->
<!-- https://github.com/sveltejs/svelte/issues/4701 for info about svelte inline TS -->
