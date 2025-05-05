<script lang="ts">
	import { ArrowLeft, Search, Ellipsis, Plus } from 'lucide-svelte';
	import BottomNavBar from '$lib/components/BottomNavBar.svelte';
	import DocumentItem from '$lib/components/Document.svelte';
	import Doc from '$lib/components/NewDocumentModal.svelte';
	import HeaderPages from '$lib/components/HeaderPages.svelte';
	import DeleteDocument from '$lib/components/DeleteDocumentModal.svelte';
	import { type Document } from '$lib/types';
	import { invalidate, invalidateAll } from '$app/navigation';

	let { data } = $props();

	let showNewDocument = $state(false);

	let query = $state('');
	let selectedDocument = $state<string | null>(null);

	let eliminateDocument = $state(false);

	function toggleDocument(id: string) {
		selectedDocument = selectedDocument === id ? null : id;
		console.log(selectedDocument);
	}

	const filteredDocument = $derived(
		data.documents.filter(
			(doc) =>
				doc.title.toLowerCase().includes(query.toLowerCase()) ||
				doc.owner_email.toLowerCase().includes(query.toLowerCase())
		)
	);

	async function onSubmitDocument() {
		showNewDocument = false;
		await invalidateAll();
	}

	function deleteDocumentRequest() {
		// Trova l'ID del documento da eliminare
		const docToDeleteId = selectedDocument;
		if (docToDeleteId !== null) {
			eliminateDocument = true;
			// Non impostare selectedDocument a null qui, serve per il modale
		} else {
			console.warn("Nessun documento selezionato per l'eliminazione");
		}
	}

	function confirmDeleteDocument() {
		if (selectedDocument !== null) {
			data.documents = data.documents.filter((doc) => doc._id !== selectedDocument);
			console.log('Documento eliminato:', selectedDocument);
		}
		eliminateDocument = false;
		selectedDocument = null;
	}

	async function cancelDeleteDocument() {
		await invalidateAll();
		eliminateDocument = false;
		selectedDocument = null; // Deseleziona anche in caso di annullamento
	}
</script>

<div class="grid-home mx-auto grid h-dvh max-w-xl">
	<HeaderPages {data} title="Gestione documenti" />

	{#if showNewDocument}
		<Doc onSubmitDocument={onSubmitDocument} onCancel={() => (showNewDocument = false)} />
	{/if}
	{#if eliminateDocument && selectedDocument !== null}
		<DeleteDocument
			documentId={selectedDocument}
			onConfirmDelete={confirmDeleteDocument}
			onCancel={cancelDeleteDocument}
		/>
	{/if}

	<main class="flex flex-grow flex-col">
		<div class="scroll-snap-y-container flex max-h-[calc(100vh-17em)] flex-col gap-2 overflow-y-auto px-4">
			<!-- Lista documenti -->
			{#if filteredDocument.length > 0}

					{#each filteredDocument as document (document._id)}
						<DocumentItem
							{document}
							open={selectedDocument === document._id}
							onToggle={() => toggleDocument(document._id)}
							onDelete={() => {
								selectedDocument = document._id;
								deleteDocumentRequest();
							}}
						/>
					{/each}
			{:else}
				<p class="text-gray py-16 text-center">Ancora nessun documento</p>
			{/if}
		</div>

		<div class="rounded-t-3xl bg-white p-4 shadow-md">
			<div class="mb-4 flex items-center justify-between">
				<div class="relative mr-4 flex-grow">
					<input
						type="text"
						bind:value={query}
						placeholder="Cerca documenti..."
						class="w-full rounded-full border border-gray-300 bg-white py-2 pl-10 pr-4 placeholder:opacity-50"
					/>
					<Search class="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
				</div>
				<button
					onclick={() => (showNewDocument = true)}
					class="item-primary flex h-12 w-12 items-center justify-center rounded-full transition duration-150 ease-in"
				>
					<Plus />
				</button>
			</div>
		</div>
	</main>

	<BottomNavBar {data} />
</div>
