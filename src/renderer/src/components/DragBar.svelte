<script lang="ts">
    import LogoHeader from '$components/LogoHeader.svelte';
</script>

<div class="w-full drag flex flex-row justify-between bg-base-300 z-50">
  <LogoHeader></LogoHeader>
  <!-- eslint-disable @typescript-eslint/explicit-function-return-type-->
  <!-- https://github.com/sveltejs/svelte/issues/4701 for info about svelte inline TS -->
  <div class="flex gap-2 h-6 mt-1">
    <div
      role="button"
      tabindex="0"
      id="minimise-app"
      on:click={() => {
        window.electron.ipcRenderer.send('minimise-app');
      }}
      on:keydown={(e) => {
        if (e.key === 'Enter') {
          //do something
        }
      }}
      class="text-white hover:bg-white hover:bg-opacity-25 hover:rounded-md z-[1000] no-drag"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 18h-15" />
      </svg>
    </div>
    <div
      role="button"
      tabindex="0"
      id="close-app"
      on:click={() => window.electron.ipcRenderer.send('quit-app')}
      on:keydown={(e) => {
        if (e.key === 'Enter') {
          //do something
        }
      }}
      class="text-white hover:bg-white hover:bg-opacity-25 hover:rounded-md z-[1000] no-drag mr-2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
  </div>
</div>
