<script lang="ts">
	import { ArrowLeft, Search, Ellipsis, Plus, Delete } from 'lucide-svelte';
	import BottomNavBar from '$lib/components/BottomNavBar.svelte';
	import FaqItem from '$lib/components/FaqItem.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import Faq from '$lib/components/NewFAQModal.svelte';
	import UpdateFaq from '$lib/components/UpdateFAQModal.svelte';
	import DeleteFaq from '$lib/components/DeleteFAQModal.svelte';
	import HeaderPages from '$lib/components/HeaderPages.svelte';

	let { data } = $props();
	let faqs = $state(data.faqs ?? []);
	let showNewFAQ = $state(false);

	let showUpdateFAQ = $state(false);
	let editingFAQ = $state<any>(null);

	let query = $state('');
	let selectedFaq = $state<number | null>(null);
	let showDeleteFAQ = $state(false);

	function toggleFaq(id: number) {
		selectedFaq = selectedFaq === id ? null : id;
		selectedFaq = selectedFaq === id ? null : id;
		console.log(selectedFaq);
	}

	const filteredFaq = $derived(
		faqs.filter(
			(doc) =>
				doc.question.toLowerCase().includes(query.toLowerCase().trim()) ||
				doc.answer.toLowerCase().includes(query.toLowerCase().trim()) ||
				doc.title.toLowerCase().includes(query.toLowerCase().trim()) ||
				doc.author.toLowerCase().includes(query.toLowerCase().trim())
		)
	);

	function newFAQ(faq: any) {
		console.log('Nuova FAQ aggiunta:', faq); // 👈 Log della nuova FAQ
		faqs = [...faqs, { id: Date.now(), ...faq }];
		showNewFAQ = false;
	}

	function updateFAQ(faq: any) {
		console.log('Faq aggiornata (input):', faq); // 👈 Log prima dell'update

		faqs = faqs.map((u) => (u.id === faq.id ? { ...u, ...faq } : u));
		console.log('Lista faq aggiornata:', faqs); // 👈 Log della lista aggiornata

		console.log('Valore attuale dello stato `faqs`:', faqs);

		showUpdateFAQ = false;
		editingFAQ = null;
	}

	function deleteFAQ() {
		showDeleteFAQ = false;
		editingFAQ = null;
	}
</script>

<div class="grid-home mx-auto grid h-dvh max-w-xl">
	<HeaderPages {data} title="Gestione FAQ" />

	{#if showNewFAQ}
		<Faq on:submitFaq={(e) => newFAQ(e.detail)} on:cancel={() => (showNewFAQ = false)} />
	{/if}

	{#if showUpdateFAQ}
		<UpdateFaq
			faq={editingFAQ}
			on:submitFaq={(e) => updateFAQ(e.detail)}
			on:cancel={() => {
				showUpdateFAQ = false;
				editingFAQ = null;
			}}
		/>
	{/if}
	{#if showDeleteFAQ}
		<DeleteFaq
			faq={editingFAQ}
			on:submitFaq={() => deleteFAQ()}
			on:cancel={() => {
				showDeleteFAQ = false;
				editingFAQ = null;
			}}
		/>
	{/if}

	<main class="flex flex-grow flex-col pt-2">
		<!-- Barra di ricerca e pulsante per nuova faq -->

		<!-- Lista FAQ -->
		{#if filteredFaq.length > 0}
			{#each filteredFaq as faq (faq.id)}
				<FaqItem
					{faq}
					open={selectedFaq === faq.id}
					on:toggle={() => toggleFaq(faq.id)}
					on:edit={(e) => {
						editingFAQ = e.detail;
						showUpdateFAQ = true;
					}}
					on:delete={(e) => {
						editingFAQ = e.detail;
						showDeleteFAQ = true;
					}}
				/>
			{/each}
		{:else}
			<p class="mt-10 text-center text-gray-500">Nessuna FAQ trovata.</p>
		{/if}

		<!-- Ricerca + Nuova FAQ -->
		<div class="rounded-t-3xl bg-white p-4">
			<div class="mb-4 flex items-center justify-between">
				<div class="relative mr-4 flex-grow">
					<input
						type="text"
						bind:value={query}
						placeholder="Cerca FAQ..."
						class="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4"
					/>
					<Search class="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
				</div>
				<button
					onclick={() => (showNewFAQ = true)}
					class="item-primary flex h-12 w-12 items-center justify-center rounded-full transition duration-150 ease-in"
				>
					<Plus />
				</button>
			</div>
		</div>
	</main>

	<BottomNavBar {data} />
</div>
