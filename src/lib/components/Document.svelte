<script lang="ts">
	import { ChevronDown, Trash2 } from 'lucide-svelte';
	import { type Document } from '$lib/types';

	import { slide } from 'svelte/transition';

	let {
		document,
		open,
		onToggle,
		onDelete
	}: { document: Document; open: boolean; onToggle: () => void; onDelete: () => void } = $props();

	$inspect("docu open", open);
	function formatDate(dateString: string): string {
		const options: Intl.DateTimeFormatOptions = {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		};
		const date = new Date(dateString);
		return date.toLocaleDateString('it-IT', options);
	}
</script>

<div class="mb-4 rounded-xl bg-white p-4 shadow-md transition">
	<div class="flex items-center justify-between">
		<div class="flex-1 pr-4">
			<h3 class="text-gray truncate text-lg font-semibold">{document.title}</h3>
			{#if !open}
				<p class="text-gray truncate text-sm opacity-50">{formatDate(document.uploaded_at)}</p>
			{/if}
		</div>
		<div class="flex items-center">
			<button
				class="text-gray rounded-full p-2 transition hover:bg-gray-200 dark:hover:text-black"
				onclick={onToggle}
				aria-label={open ? `Chiudi dettagli ${document.title}` : `Apri dettagli ${document.title}`}
			>
				<ChevronDown
					class={`h-5 w-5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
				/>
			</button>
		</div>
	</div>

	{#if open}
		<div class="mt-4" transition:slide={{ duration: 200 }}>
			<p><span class="font-medium">Caricato da:</span> {document.owner_email}</p>
			<p>
				<span class="font-medium">Data caricamento:</span>
				{formatDate(document.uploaded_at)}
			</p>
			<div class="mt-4 border-t border-gray-500 border-opacity-50">
				<button
					class="mt-4 box-border flex items-center rounded-full border-2 border-red-500 px-4 py-2 transition hover:bg-red-500"
					onclick={onDelete}
				>
					<Trash2 class="mr-2 h-4 w-4" />
					<span>Elimina</span>
				</button>
			</div>
		</div>
	{/if}
</div>
