<script lang="ts">
  const id = crypto.randomUUID();
  export const open = (): void => {
    const dialog: HTMLDialogElement = document.getElementById(`${id}_dialog`) as HTMLDialogElement;
    dialog.showModal();
  };

  export let closeType: 'button' | 'cross' | 'none' = 'none';
  export let title: string = '';
  export let buttons: { title: string; callback(): void }[] | null = null;
  export let style: {
    dialog?: string;
    modalBox?: string;
    title?: string;
    content?: string;
  } = {};
</script>

<dialog id={`${id}_dialog`} class="modal {style.dialog}">
  <div class="modal-box {style.modalBox}">
    {#if closeType === 'cross'}
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
    {/if}
    <h3 class={style.title ? style.title : 'font-bold text-lg'}>{title}</h3>
    <div class={style.content}>
      <slot />
    </div>
    {#if closeType === 'button'}
      <div class="modal-action">
        <form method="dialog">
          {#if buttons && buttons.length > 0 && closeType !== 'button'}
            {#each buttons as button}
              <button on:click|preventDefault={button.callback} class="btn">{button.title}</button>
            {/each}
          {:else if buttons && buttons.length > 0 && closeType === 'button'}
            {#each buttons as button}
              <button on:click|preventDefault={button.callback} class="btn">{button.title}</button>
            {/each}
            <button class="btn">Close</button>
          {:else if closeType === 'button' && buttons === null}
            <button class="btn">Close</button>
          {/if}
        </form>
      </div>
    {/if}
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
