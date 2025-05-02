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
		console.log(selectedDocument)
	}

	const filteredDocument = $derived(
		documents.filter((doc) =>
			doc.name.toLowerCase().includes(query.toLowerCase()) ||
			doc.author.toLowerCase().includes(query.toLowerCase())
		)
	);

	function newDocument(doc : any) {
		console.log('Nuovo documento aggiunto:', documents); // 👈 Log del nuovo documento
		documents = [...documents, {id: Date.now(), ...doc}];
		showNewDocument = false;
	}

	function deleteDocumentRequest(){
		eliminateDocument = true;
		selectedDocument = null;
	}
</script>

<div class="grid-home mx-auto grid h-dvh max-w-xl">
	<HeaderPages {data} title="Gestione documenti" />

	{#if showNewDocument}
	<Doc
		on:submitDocument={(e) => newDocument(e.detail)}
		on:cancel={() =>
			showNewDocument = false}
	/>
   {/if}
   {#if eliminateDocument}
	<DeleteDocument
	    document = {selectedDocument}
		on:submitDocument={() => deleteDocumentRequest()}
		on:cancel={() => {
			eliminateDocument = false;
            selectedDocument = null;
		    }
		}
	/>
   {/if}

	<main class="flex flex-col pt-2 flex-grow overflow-y-auto">

		<!-- Lista documenti -->
		{#if filteredDocument.length > 0}
			{#each filteredDocument as document (document.id)}
				<DocumentItem
					{document}
					open={selectedDocument === document.id}
					on:toggle={() => toggleDocument(document.id)}
					on:delete={() => deleteDocumentRequest()}
				/>
			{/each}
		{:else}
			<p class="text-center text-gray-500 mt-10">Nessun documento trovato.</p>
		{/if}

        <div class="rounded-t-3xl bg-white p-4">
            <div class="flex justify-between items-center mb-4">
                <div class="relative flex-grow mr-4">
                    <input
                        type="text"
                        bind:value={query}
                        placeholder="Cerca documenti..."
                        class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white"
                    />
                    <Search class="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
                </div>
                <button
                    onclick={() => showNewDocument = true}
                    class="flex items-center justify-center h-12 w-12 rounded-full item-primary transition duration-150 ease-in"
				>
                    <Plus />
                </button>
            </div>
        </div>
	</main>

	<BottomNavBar {data} />
</div>
