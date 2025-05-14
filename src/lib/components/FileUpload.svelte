<script lang="ts">
	let {
		label,
		file = $bindable(),
		name = $bindable('Nessun file selezionato'),
		accept = 'image/*',
		contextLabel = ''
	}: {
		label: string;
		file?: File | null;
		name?: string;
		accept?: string;
		contextLabel?: string;
	} = $props();

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
	<!-- svelte-ignore a11y_label_has_associated_control -->
	<label class="mb-4 block font-semibold">
		{label}
		{#if contextLabel}<span class="text-xs">({contextLabel})</span>{/if}
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
			class="flex items-center justify-between rounded-full border border-gray-300 bg-white p-3 dark:border-gray-500"
			aria-hidden="true"
		>
			<span
				class="text-gray ml-2 truncate text-sm {name?.startsWith('Nessun file')
					? 'opacity-50'
					: 'opacity-100'}">{name}</span
			>
			<span class="bg-gray cursor-pointer rounded-full px-4 py-1 text-sm transition">Carica</span>
		</div>
	</div>
</div>
