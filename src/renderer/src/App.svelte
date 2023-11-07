<!-- App.svelte -->
<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { SvelteToast } from '@zerodevx/svelte-toast';
  import { Router, Route } from 'svelte-routing';
  import rendererLogger from '$lib/helpers/logger';
  import DragBar from '$components/DragBar.svelte';
  import DevTools from '$components/DevTools.svelte';

  import Setup from '$routes/Setup.svelte';
  import Progress from '$routes/Progress.svelte';
  import Test from '$routes/Test.svelte';

  export let url = '';

  onMount(() => {
    rendererLogger.silly('App.svelte mounted');
  });

  onDestroy(() => {
    rendererLogger.silly('App.svelte destroyed');
  });
</script>

<div class="h-screen w-screen flex flex-col">
  <DragBar />

  {#if import.meta.env.DEV}
    <div class="z-50">
      <DevTools />
    </div>
  {/if}

  <main
    class="flex flex-col w-screen flex-grow justify-center items-center text-white overflow-hidden"
  >
    <Router {url}>
      <Route path="/"><Setup /></Route>
      <Route path="/Progress"><Progress /></Route>
      <Route path="/Test"><Test /></Route>
    </Router>
    <SvelteToast options={{ pausable: true, classes: ['w-72'] }} />
  </main>
</div>

<!-- eslint-enable @typescript-eslint/explicit-function-return-type-->
<style lang="postcss">
  *,
  *::after,
  *::before {
    -webkit-user-select: none;
    -webkit-user-drag: none;
    /* -webkit-app-region: no-drag;
		cursor: default; */
  }
  :root {
    --toastContainerTop: auto;
    --toastContainerRight: 1rem;
    --toastContainerBottom: 1rem;
  }
  :global(body) {
    background-color: theme(colors.base-300);
    user-select: none;
  }
</style>
