<script lang="ts">
	import { ChevronDown, Trash2, PenIcon } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';

	let { faq, open } = $props();
	
	const dispatch = createEventDispatcher();

	const abbrQuestion = faq.abbr.length > 30
		? faq.abbr.slice(0, 40) + '…'
		: faq.abbr;
</script>

<div class="mb-4 rounded-xl bg-white p-4 shadow-md transition">
	<div class="flex items-center justify-between">
		<div>
			<h3 class="text-lg font-semibold">{open ? faq.abbr : abbrQuestion}</h3>
			<div class="flex space-x-4">
				<button class="flex items-center text-orange-600 hover:text-orange-700 transition" on:click={() => dispatch('edit', faq)}>
					<PenIcon class="mr-1 h-4 w-4" />
					<span>Modifica</span>
				</button>
				<button class="flex items-center text-red-600 hover:text-red-700 transition">
					<Trash2 class="mr-1 h-4 w-4" />
					<span>Elimina</span>
				</button>
			</div>
		</div>
		<button
			class="text-gray-500 hover:text-gray-700 transition"
			on:click={() => dispatch('toggle')}
		>
			<ChevronDown class={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
		</button>
	</div>

	{#if open}
		<div class="mt-4 border-t pt-4 text-sm text-gray-700">
			<p class="text-sm text-gray-600">{faq.author} • {faq.creationDate}</p>
			<p class="mb-4">{faq.question}</p>
		</div>
	{/if}
</div>
