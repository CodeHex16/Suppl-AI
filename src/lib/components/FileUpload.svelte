<script lang="ts">
    export let label: string;
    export let fileStore;
    export let nameStore;
    export let accept = 'image/*';
    export let contextLabel: string = '';
  
    function handleChange(event: Event) {
      const input = event.target as HTMLInputElement;
      if (input?.files?.length) {
        fileStore.set(input.files[0]);
        nameStore.set(input.files[0].name);
      }
    }
  </script>
  
  <div class="mb-4 rounded-xl bg-white shadow-md p-4 transition">
    <label class="block mb-2 font-medium text-sm">
      {label} {#if contextLabel}<span class="text-xs">({contextLabel})</span>{/if}
    </label>
    <div class="relative">
      <input
        type="file"
        accept={accept}
        on:change={handleChange}
        class="absolute inset-0 opacity-0 cursor-pointer"
      />
      <div class="flex items-center justify-between border border-gray-300 rounded-lg p-3 bg-white">
        <span class="text-sm text-gray truncate">{$nameStore}</span>
        <a class="cursor-pointer px-3 py-1 bg-gray text-sm rounded border border-gray-300 transition">Sfoglia</a>
      </div>
    </div>
  </div>
  