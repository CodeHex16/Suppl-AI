<script lang="ts">
	import { ArrowLeft, Search, Ellipsis, Plus } from 'lucide-svelte';
	import BottomNavBar from '$lib/components/BottomNavBar.svelte';
	import DocumentItem from '$lib/components/Document.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import Doc from '$lib/components/NewDocumentModal.svelte';
	import { writable, derived } from 'svelte/store';

	let { data } = $props();

	const documents = writable(data.documents ?? []);
	const showNewDocument = writable(false);

	const query = writable('');
	const selectedDocument = writable<number | null>(null);

	function toggleDocument(id: number) {
		selectedDocument.update((current) => (current === id ? null : id));
		console.log(selectedDocument)
	}

	const filteredDocument = derived([query], ([$query]) => {
		if (!data?.documents) return [];
		return data.documents.filter((doc) =>
			doc.name.toLowerCase().includes($query.toLowerCase()) ||
			doc.author.toLowerCase().includes($query.toLowerCase())
		);
	});

	function newDocument(doc : any) {
		console.log('Nuova FAQ aggiunta:', documents); // 👈 Log del nuovo documento
		documents.update(prev => [...prev, {id: Date.now(), ...doc}]);
		showNewDocument.set(false);
	}
</script>

<div class="grid-home mx-auto grid h-dvh max-w-xl">
	<header class="mt-4">
		<nav class="grid grid-cols-3 items-center px-4">
			<a href="/">
				<div class="h-12 w-12 justify-self-start rounded-full bg-gray shadow-md p-3 transition">
					<ArrowLeft />
				</div>
			</a>
			<h1 class="text-center text-lg font-semibold">Gestione documenti</h1>
			<ThemeToggle />
		</nav>
	</header>

	{#if $showNewDocument}
	<Doc
		on:submitDocument={(e) => newDocument(e.detail)}
		on:cancel={() => showNewDocument.set(false)}
	/>
   {/if}
   
	<main class="flex flex-col pt-2 flex-grow overflow-y-auto">		

		<!-- Lista documenti -->
		{#if $filteredDocument.length > 0}
			{#each $filteredDocument as document (document.id)}
				<DocumentItem
					{document}
					open={$selectedDocument === document.id}
					on:toggle={() => toggleDocument(document.id)}
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
                        bind:value={$query}
                        placeholder="Cerca documenti..."
                        class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white"
                    />
                    <Search class="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
                </div>
                <button
                    on:click={() => showNewDocument.set(true)}
                    class="flex items-center justify-center h-12 w-12 rounded-full item-primary transition duration-150 ease-in"
				>
                    <Plus />
                </button>
            </div>
        </div>
	</main>

	<BottomNavBar {data} />
</div>
