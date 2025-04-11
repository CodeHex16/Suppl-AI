<script lang="ts">
	import { ArrowLeft, Search, Ellipsis, Plus } from 'lucide-svelte';
	import BottomNavBar from '$lib/components/BottomNavBar.svelte';
	import FaqItem from '$lib/components/FaqItem.svelte';
	import { writable, derived } from 'svelte/store';

	let { data } = $props();

	const showModal = writable(false);

	const query = writable('');
	const selectedFaq = writable<number | null>(null);

	function toggleFaq(id: number) {
		selectedFaq.update((current) => (current === id ? null : id));
		console.log(selectedFaq)
	}



	const filteredFaq = derived([query], ([$query]) => {
		if (!data?.faqs) return [];
		return data.faqs.filter((doc) =>
			doc.question.toLowerCase().includes($query.toLowerCase()) ||
			doc.abbr.toLowerCase().includes($query.toLowerCase()) ||
			doc.author.toLowerCase().includes($query.toLowerCase())
		);
	});

	function newFaq() {
		console.log('Nuova FAQ');
	}
</script>

<div class="grid-home mx-auto grid h-dvh max-w-xl">
	<header class="mt-4">
		<nav class="grid grid-cols-3 items-center px-4">
			<a href="/">
				<div class="h-12 w-12 justify-self-start rounded-full bg-white p-3 hover:bg-gray-100 transition">
					<ArrowLeft />
				</div>
			</a>
			<h1 class="text-center text-lg font-semibold">Gestione FAQ</h1>
			<div class="h-12 w-12 justify-self-end rounded-full bg-white p-3 hover:bg-gray-100 transition">
				<Ellipsis />
			</div>
		</nav>
	</header>

	<main class="flex flex-col pt-2 flex-grow overflow-y-auto">
		<!-- Lista FAQ -->
		{#if $filteredFaq.length > 0}
			{#each $filteredFaq as faq (faq.id)}
				<FaqItem
					{faq}
					open={$selectedFaq === faq.id}
					on:toggle={() => toggleFaq(faq.id)}
				/>
			{/each}
		{:else}
			<p class="text-center text-gray-500 mt-10">Nessuna FAQ trovata.</p>
		{/if}

		<!-- Ricerca + Nuova FAQ -->
		<div class="rounded-t-3xl bg-white p-4">
			<div class="flex justify-between items-center mb-4">
				<div class="relative flex-grow mr-4">
					<input
						type="text"
						bind:value={$query}
						placeholder="Cerca FAQ..."
						class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
					/>
					<Search class="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
				</div>
				<button
					on:click={newFaq}
					class="flex items-center justify-center h-12 w-12 rounded-full bg-blue-500 text-white transition duration-150 ease-in hover:bg-blue-600"
				>
					<Plus />
				</button>
			</div>
		</div>
	</main>

	<BottomNavBar {data} />
</div>
