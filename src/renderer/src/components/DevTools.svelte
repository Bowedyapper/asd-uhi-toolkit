<script lang="ts">
  import { animationSpeed, currentView } from '$lib/stores/main';
</script>

<div
  class="absolute right-4 bottom-4 bg-base-200 flex flex-col p-3 border border-base-100 rounded-md"
>
  <div class="text-sm font-medium">Dev tools</div>
  <div class="w-32">
    <label for="minmax-range" class="block text-sm text-gray-900 dark:text-white">
      Animation Speed
    </label>
    <input
      bind:value={$animationSpeed}
      id="minmax-range"
      type="range"
      min="0.1"
      max="2"
      step="0.1"
      class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
    />
  </div>
  <div class="text-white">
    <button
      on:click={() => currentView.set('Setup')}
      type="button"
      class="xt-button py-2 px-2 text-xs rounded-md uppercase text-gray-900 bg-gray-100 transition hover:bg-gray-200 active:bg-gray-300 on:bg-gray-200"
    >
      Setup
    </button>
    <button
      on:click={() => currentView.set('Progress')}
      type="button"
      class="xt-button py-2 px-2 text-xs rounded-md uppercase text-gray-900 bg-gray-100 transition hover:bg-gray-200 active:bg-gray-300 on:bg-gray-200"
    >
      Progress
    </button>
    <button
      on:click={() => currentView.set('Test')}
      type="button"
      class="xt-button py-2 px-2 text-xs rounded-md uppercase text-gray-900 bg-gray-100 transition hover:bg-gray-200 active:bg-gray-300 on:bg-gray-200"
    >
      Test
    </button>
  </div>
</div>
