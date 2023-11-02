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

  onMount(() => {
    componentTimeline.from('#main', {
      autoAlpha: 0,
      duration: 0.5,
      stagger: 1
    });

    componentTimeline.to('#main', {
      autoAlpha: 0,
      delay: 1
    });
  });
</script>
<div class="flex flex-col justify-center items-center w-full h-full -mt-10">
    <h1 class="font-bold text-4xl" id="main">Hello!</h1>
    <h1 class="font-bold text-4xl" id="main">Lets get you set up!</h1>
</div>