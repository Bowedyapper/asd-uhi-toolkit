<script lang="ts">
  import uhiLogo from '$assets/uhi.png';
  import { onMount, onDestroy } from 'svelte';
  import rendererLogger from '$lib/helpers/logger';
  import gsap from 'gsap';

  const timeline = gsap.timeline();
  onMount(() => {
    rendererLogger.silly('LogoHeader.svelte mounted');
    timeline.from('#uhi-logo', {
      autoAlpha: 0,
      duration: 1
    });

    timeline.from(
      '#app-text',
      {
        autoAlpha: 0,
        duration: 1,
        stagger: 1
      },
      '-=1'
    );
  });

  onDestroy(() => {
    rendererLogger.silly('LogoHeader.svelte destroyed');
  });
</script>

<div class="ml-8 flex flex-row relative float-left justify-center items-center text-white h-24">
  <img id="uhi-logo" class="h-10 w-auto" src={uhiLogo} alt="UHI Logo" />
  <p id="app-text" class="font-light ml-4">Applied Software Development Toolkit</p>
</div>
