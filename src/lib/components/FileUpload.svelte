<script lang="ts">
    let {
        label,
        file = $bindable(), 
        name = $bindable(), 
        accept = 'image/*',
        contextLabel = ''
    }: {
        label: string;
        file?: File | null; 
        name?: string;    
        accept?: string;
        contextLabel?: string;
    } = $props();

    if (name === undefined) {
        name = 'Nessun file selezionato';
    }

    function handleChange(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input?.files?.length) {
            file = input.files[0];
            name = input.files[0].name;
        } else {
            file = null;
            name = 'Nessun file selezionato';
        }
    }
</script>

<div class="mb-4 rounded-xl bg-white p-4 shadow-md transition">
    <label class="mb-4 block font-semibold">
        {label} {#if contextLabel}<span class="text-xs">({contextLabel})</span>{/if}
    </label>
    <div class="relative">
        <input
            type="file"
            {accept}
            onchange={handleChange}
            class="absolute inset-0 cursor-pointer opacity-0"
            aria-label={label}
        />
        <div
            class="flex items-center justify-between border border-gray-300 dark:border-gray-500 bg-white p-3 rounded-full"
            aria-hidden="true"
        >
            <span class="ml-2 truncate text-sm text-gray {name?.startsWith('Nessun file')?'opacity-50':'opacity-100'}">{name}</span>
            <span class="cursor-pointer rounded-full bg-gray px-4 py-1 text-sm transition">Carica</span>
        </div>
    </div>
</div>
