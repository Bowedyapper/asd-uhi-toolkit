<script lang="ts">
  import gsap from 'gsap';
  import { onMount } from 'svelte';
  import { animationSpeed, studentInfo } from '$lib/stores/main';

  export let onAnimComplete: () => void = () => {};
  export let onAnimReverseComplete: () => void = () => {};

  export const componentTimeline = gsap.timeline({
    onComplete: onAnimComplete,
    onReverseComplete: onAnimReverseComplete,
    paused: true
  });

  $: $animationSpeed,
    ((): void => {
      componentTimeline.timeScale($animationSpeed);
    })();

  onMount(() => {
    componentTimeline.from('#year-of-study', {
      autoAlpha: 0,
      duration: 0.5,
      stagger: 1
    });

    componentTimeline.to('#year-of-study', {
      duration: 2,
      fontSize: '1.5rem',
      lineHeight: '2rem',
      stagger: 1,
      bottom: '2rem',
      left: '2rem',
      ease: 'power2.inOut'
    });
  });
</script>

<h1 class="absolute font-bold text-4xl -mt-20" id="year-of-study">Year {$studentInfo.year}</h1>
