<script lang="ts">
	import { ChevronDown, Trash2, PenIcon, HelpCircle, MessageSquareText } from 'lucide-svelte';
	import { slide } from 'svelte/transition';
	import { type Faq } from '$lib/types';
	import { abbrWithEllipsis } from '$lib/utils/string';

	let {
		faq,
		open,
		onToggle,
		onEdit,
		onDelete
	}: {
		faq: Faq;
		open: boolean;
		onToggle: () => void;
		onEdit: (faq: Faq) => void;
		onDelete: (faq: Faq) => void;
	} = $props();

	
	const abbrQuestion = abbrWithEllipsis(faq.question, 30);

</script>

<div class="mb-4 rounded-xl bg-white p-4 shadow-md transition">
	<div class="flex items-center justify-between">
		<div class="min-w-0">
			<h3
				class="max-w-56 overflow-hidden text-ellipsis whitespace-nowrap text-lg font-semibold"
			>
				{faq.title}
			</h3>
		</div>
		<button
			class="text-gray rounded-full p-2 transition hover:bg-gray-200 dark:hover:text-black"
			onclick={onToggle}
			aria-label={open ? `Chiudi dettagli ${faq.title}` : `Apri dettagli ${faq.title}`}
		>
			<ChevronDown
				class={`h-5 w-5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
			/>
		</button>
	</div>

	{#if open}
		<div transition:slide={{ duration: 200 }}>
			<div class="my-4">
				<div class="faq-item-grid mb-4 gap-4">
					<HelpCircle class="text-gray my-1 h-5 w-5" />
					<p class="text-gray break-words overflow-hidden font-semibold italic">
						"{faq.question}"
					</p>
				</div>

				<div class="faq-item-grid mb-4 gap-4">
					<MessageSquareText class="text-gray my-1 h-5 w-5" />
					<p class="text-gray overflow-hidden break-words">{faq.answer}</p>
				</div>
			</div>

			<div class="mt-4 flex space-x-4 border-t border-gray-500 border-opacity-50 pt-4">
				<button
					class="box-border flex items-center rounded-full border-2 border-amber-500 px-4 py-2 transition hover:bg-amber-500"
					onclick={() => onEdit(faq)}
				>
					<PenIcon class="mr-2 h-4 w-4" />
					<span>Modifica</span>
				</button>
				<button
					class="box-border flex items-center rounded-full border-2 border-red-500 px-4 py-2 transition hover:bg-red-500"
					onclick={() => onDelete(faq)}
				>
					<Trash2 class="mr-2 h-4 w-4" />
					<span>Elimina</span>
				</button>
			</div>
		</div>
	{/if}
</div>

<style>
	.faq-item-grid {
		display: grid;
		grid-template-columns: auto 1fr;
	}
</style>
