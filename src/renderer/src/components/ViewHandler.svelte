<script lang="ts">
  import rendererLogger from '$lib/helpers/logger';
  import { SvelteComponent, onMount, onDestroy } from 'svelte';
  import moment from 'moment';

  onMount(() => {
    rendererLogger.silly('ViewHandler.svelte mounted');
  });

  onDestroy(() => {
    rendererLogger.silly('ViewHandler.svelte destroyed');
  });

  rendererLogger.debug('Loading views');

  const getViews = import.meta.glob('$views/*.svelte');
  const viewComponents = {};
  const loadStartTime = moment();
  const promises = [];
  const loadComponent = async (path: string): Promise<void> => {
    return new Promise((resolve) => {
      getViews[path]().then(async (component: SvelteComponent) => {
        const name = component.default.name.replace('Proxy<', '').replace('>', '');
        await import(`$views/${name}.svelte`).then((component) => {
          viewComponents[name] = component.default;
          resolve();
        });
      });
    });
  };

  const loadEnd = (): void => {
    rendererLogger.debug(
      `${Object.keys(viewComponents).length} views loaded in ${moment().diff(
        loadStartTime,
        'millisecond'
      )} ms`
    );
  };

  for (const path in getViews) {
    promises.push(loadComponent(path));
  }

  export let currentView: string;
</script>

{#await Promise.all(promises).then(loadEnd)}
  <p>Loading...</p>
{:then}
  {#if currentView in viewComponents}
    <svelte:component this={viewComponents[currentView]} />
  {:else}
    <h1>{currentView} Not found</h1>
  {/if}
{/await}
