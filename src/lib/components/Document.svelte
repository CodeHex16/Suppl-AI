<script lang="ts">
	import { ChevronDown, Trash2 } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';

	let { document, open } = $props();

	const dispatch = createEventDispatcher();
</script>

<div class="mb-4 rounded-xl bg-white p-4 shadow-md transition">
	<div class="flex items-center justify-between">
		<div>
			<h3 class="text-lg font-semibold">{document.name}</h3>
			<button class="flex items-center text-red-600 hover:text-red-700 transition">
				<Trash2 class="mr-2 h-4 w-4" />
				<span>Elimina</span>
			</button>
		</div>
		<button
			class="text-gray-500 hover:text-gray-700 transition"
			onclick={() => dispatch('toggle')}
		>
			<ChevronDown class={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
		</button>
	</div>

	{#if open}
		<div class="mt-4 border-t pt-4 text-sm text-gray-700">
			<p class="text-sm text-gray">{document.author} • {document.creationDate}</p>
		</div>
	{/if}
</div>
