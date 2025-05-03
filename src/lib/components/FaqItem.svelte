<script lang="ts">
	import { ChevronDown, Trash2, PenIcon } from 'lucide-svelte';

	// Definisci le props callback
	let { faq, open, ontoggle, onedit, ondelete } = $props<{
		faq: any;
		open: boolean;
		ontoggle: () => void;
		onedit: (faq: any) => void;
		ondelete: (faq: any) => void;
	}>();

	const abbrQuestion = faq.title.length > 30 ? faq.title.slice(0, 40) + '…' : faq.title;
</script>

<div class="mb-4 rounded-xl bg-white p-4 shadow-md transition">
	<div class="flex items-center justify-between">
		<div>
			<h3 class="text-lg font-semibold">{open ? faq.title : abbrQuestion}</h3>
			<div class="flex space-x-4">
				<button
					class="flex items-center text-yellow-500 transition hover:text-yellow-600"
					onclick={() => onedit(faq)}
				>
					<PenIcon class="mr-1 h-4 w-4" />
					<span>Modifica</span>
				</button>
				<button
					class="flex items-center text-red-600 transition hover:text-red-700"
					onclick={() => ondelete(faq)}
				>
					<Trash2 class="mr-1 h-4 w-4" />
					<span>Elimina</span>
				</button>
			</div>
		</div>
		<button class="text-gray-500 transition hover:text-gray-700" onclick={ontoggle}>
			<ChevronDown class={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
		</button>
	</div>

	{#if open}
		<div class="mt-4 border-t pt-4 text-sm text-gray-700">
			<p class="text-gray text-sm">
				{faq.author} • {new Date(faq.creationDate).toLocaleDateString()}
			</p>
			<p class="text-gray mb-4">{faq.question}</p>
			<p class="text-gray mb-4">{faq.answer}</p>
		</div>
	{/if}
</div>
