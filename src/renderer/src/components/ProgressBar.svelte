<script lang="ts">
  export let value;
  export let max; // Adjust this to your desired word limit
</script>

<div class="relative w-32 bg-gray-900 rounded-lg">
  <div class="flex justify-center items-center absolute w-full h-full text-center">
    {value}/{max}
  </div>
  <div
    class="bg-gray-600 rounded-lg text-white h-8 max-w-full"
    style="width: {(value / max) * 100}%;"
  />
</div>
