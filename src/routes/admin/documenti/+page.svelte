<script lang="ts">
	import { ArrowLeft, Search, Ellipsis, Plus } from 'lucide-svelte';
	import BottomNavBar from '$lib/components/BottomNavBar.svelte';
	import DocumentItem from '$lib/components/Document.svelte';
	import Doc from '$lib/components/NewDocumentModal.svelte';
	import HeaderPages from '$lib/components/HeaderPages.svelte';
	import DeleteDocument from '$lib/components/DeleteDocumentModal.svelte';
	import { type Document, type User } from '$lib/types';
	import { invalidateAll } from '$app/navigation';
	import { logger } from '$lib/utils/logger';
	import { error } from '@sveltejs/kit';

	let { data }:{
		data: {
			documents: Document[],
			user: User,
			theme: string,
		};
	} = $props();

	let showNewDocument = $state(false);

	let query = $state('');
	let selectedDocument = $state<Document | null>(null);

	let eliminateDocument = $state(false);
	let deleteErrorMessage = $state<string | null>(null);

	function toggleDocument(doc: Document) {
		selectedDocument = selectedDocument?._id === doc._id ? null : doc;
		logger.log('selectedDocument', selectedDocument);
	}

	const filteredDocument = $derived(
		data.documents.filter(
			(doc: Document) =>
				doc.title.toLowerCase().includes(query.toLowerCase()) ||
				doc.owner_email.toLowerCase().includes(query.toLowerCase())
		)
	);


	function deleteDocumentRequest() {
		const docToDeleteId = selectedDocument;
		logger.log('ID documento da eliminare:', docToDeleteId);
		if (docToDeleteId !== null) {
			eliminateDocument = true;
			deleteErrorMessage = null;
		} else {
			logger.warn("Nessun documento selezionato per l'eliminazione");
		}
	}	

	async function confirmDeleteDocument(form: FormData) {
		logger.log('DELETE form', form);

		const ris = await fetch('/api/documents', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id: form.get('id'),
				title: form.get('title'),
				current_password: form.get('current_password')
			})
		});

		if (ris.status === 200) {
			logger.log('Documento eliminato con successo');
			await invalidateAll();
			eliminateDocument = false;
			selectedDocument = null;
			deleteErrorMessage = null;
		} else {


			const errorData = await ris.json();
			logger.error('Errore durante l\'eliminazione del documento', errorData);
			if (errorData.error === 'Unauthorized') {
				deleteErrorMessage = 'Password errata. Riprova.';
			} else if (errorData.error === 'Document not found') {
				deleteErrorMessage = 'Documento non trovato. Riprova.';
			} else if (errorData.error === 'Document already deleted') {
				deleteErrorMessage = 'Documento già eliminato. Riprova.';
			} else if (errorData.error === 'Invalid request') {
				deleteErrorMessage = 'Richiesta non valida. Riprova.';
			} else if (errorData.error === 'Internal server error') {
				deleteErrorMessage = 'Errore interno del server. Riprova più tardi.';
			}
		}

	}

	async function cancelDeleteDocument() {
		await invalidateAll();
		eliminateDocument = false;
		deleteErrorMessage = null;
	}
</script>

<div class="grid-home mx-auto grid h-dvh max-w-xl">
	<HeaderPages {data} title="Gestione documenti" />

	{#if showNewDocument}
		<Doc onSubmitDocument={async()=> {await invalidateAll()}} onCancel={() => (showNewDocument = false)} />
	{/if}
	
	{#if eliminateDocument && selectedDocument !== null}
		<DeleteDocument
			document={selectedDocument}
			onConfirmDelete={confirmDeleteDocument}
			onCancel={cancelDeleteDocument}
			errorMessage={deleteErrorMessage}
		/>
	{/if}

	<main class="flex flex-grow flex-col">
		<div
			class="scroll-snap-y-container flex max-h-[calc(100vh-17em)] flex-col gap-2 overflow-y-auto px-4"
		>
			<!-- Lista documenti -->
			{#if filteredDocument.length > 0}
				{#each filteredDocument as document (document._id)}
					<DocumentItem
						{document}
						open={selectedDocument?._id === document._id}
						onToggle={() => toggleDocument(document)}
						onDelete={() => {
							selectedDocument = document;
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
