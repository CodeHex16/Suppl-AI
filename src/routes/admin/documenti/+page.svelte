<script lang="ts">
	import { ArrowLeft, Search, Ellipsis, Plus } from 'lucide-svelte';
	import BottomNavBar from '$lib/components/BottomNavBar.svelte';
	import DocumentItem from '$lib/components/Document.svelte';
	import Doc from '$lib/components/NewDocumentModal.svelte';
	import HeaderPages from '$lib/components/HeaderPages.svelte';
	import DeleteDocument from '$lib/components/DeleteDocumentModal.svelte';

	let { data } = $props();

	let documents = $state(data.documents ?? []);
	let showNewDocument = $state(false);

	let query = $state('');
	let selectedDocument = $state<number | null>(null);

	let eliminateDocument = $state(false);

	function toggleDocument(id: number) {
		selectedDocument = selectedDocument === id ? null : id;
		console.log(selectedDocument);
	}

	const filteredDocument = $derived(
		documents.filter(
			(doc) =>
				doc.name.toLowerCase().includes(query.toLowerCase()) ||
				doc.author.toLowerCase().includes(query.toLowerCase())
		)
	);

	function newDocument(doc: any) {
		console.log('Nuovo documento aggiunto:', documents); // 👈 Log del nuovo documento
		documents = [...documents, { id: Date.now(), ...doc }];
		showNewDocument = false;
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
			documents = documents.filter((doc) => doc.id !== selectedDocument);
			console.log('Documento eliminato:', selectedDocument);
		}
		eliminateDocument = false;
		selectedDocument = null;
	}

	function cancelDeleteDocument() {
		eliminateDocument = false;
		selectedDocument = null; // Deseleziona anche in caso di annullamento
	}
</script>

<div class="grid-home mx-auto grid h-dvh max-w-xl">
	<HeaderPages {data} title="Gestione documenti" />

	{#if showNewDocument}
		<Doc onSubmitDocument={(doc) => newDocument(doc)} onCancel={() => (showNewDocument = false)} />
	{/if}
	{#if eliminateDocument && selectedDocument !== null}
		<DeleteDocument
			documentId={selectedDocument}
			onConfirmDelete={confirmDeleteDocument}
			onCancel={cancelDeleteDocument}
		/>
	{/if}

	<main class="flex flex-grow flex-col overflow-y-auto pt-2">
		<!-- Lista documenti -->
		{#if filteredDocument.length > 0}
			<div class="px-4">
				{#each filteredDocument as document (document.id)}
					<DocumentItem
						{document}
						open={selectedDocument === document.id}
						onToggle={() => toggleDocument(document.id)}
						onDelete={() => {
							selectedDocument = document.id;
							deleteDocumentRequest();
						}}
					/>
				{/each}
			</div>
		{:else}
			<p class="mt-10 text-center text-gray-500">Nessun documento trovato.</p>
		{/if}

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
