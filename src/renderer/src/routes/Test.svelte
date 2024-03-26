<script lang="ts">
  import Dialog from '$components/Dialog.svelte';
  import TestComponent from '$components/TestComponent.svelte';

  let dialog1: Dialog;
  let dialog2: Dialog;
</script>

<button class="btn btn-primary" on:click={() => dialog1.open()}>Open Modal</button>
<Dialog
  bind:this={dialog1}
  title="Dialog 1"
  closeType="cross"
  buttons={[
    {
      title: 'smd',
      callback: () => {
        console.log('smd');
      }
    }
  ]}
>
  <TestComponent />
</Dialog>
