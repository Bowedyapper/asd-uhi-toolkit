<!-- App.svelte -->
<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { SvelteToast } from '@zerodevx/svelte-toast';
  import { currentView } from '$lib/stores/main';
  import rendererLogger from '$lib/helpers/logger';
  import DragBar from '$components/DragBar.svelte';
  import DevTools from '$components/DevTools.svelte';
  import ViewHandler from '$components/ViewHandler.svelte';

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
    <ViewHandler currentView={$currentView}></ViewHandler>
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
