<script lang="ts">
	import { Search, Plus } from 'lucide-svelte';
	import BottomNavBar from '$lib/components/BottomNavBar.svelte';
	import FaqItem from '$lib/components/FaqItem.svelte';
	import Faq from '$lib/components/NewFAQModal.svelte';
	import UpdateFaq from '$lib/components/UpdateFAQModal.svelte';
	import DeleteFaq from '$lib/components/DeleteFAQModal.svelte';
	import HeaderPages from '$lib/components/HeaderPages.svelte';
	import { invalidateAll } from '$app/navigation';
	import type {Faq as FAQ} from '$lib/types';
	import { logger } from '$lib/utils/logger.js';


	let { data } = $props();
	let faqs = $state<FAQ[]>(data.faqs ?? []);
	let showNewFAQ = $state(false);

	let showUpdateFAQ = $state(false);

	let editingFAQ = $state<FAQ | null>(null);

	let query = $state('');
	let selectedFaqId = $state<string | null>(null);
	let showDeleteFAQ = $state(false);

	function toggleFaq(faq: FAQ) {
		selectedFaqId = selectedFaqId === String(faq._id) ? null : String(faq._id);
	}

	const filteredFaq = $derived(
		faqs.filter(
			(doc) =>
				doc.question.toLowerCase().includes(query.toLowerCase().trim()) ||
				doc.answer.toLowerCase().includes(query.toLowerCase().trim()) ||
				doc.title.toLowerCase().includes(query.toLowerCase().trim())
		)
	);

	/**
	 * Aggiungi una nuova FAQ
	 * @param faq
	 */
	async function newFAQ(faq: FAQ) {
		logger.log('Nuova FAQ aggiunta:', faq);
		const ris = await fetch('/api/faqs', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(faq)
		});
		if (ris.ok) {
			const faq = await ris.json();
			faqs = [...faqs, faq.faq];
			showNewFAQ = false;
			logger.log('FAQ aggiunta:', faq);
		} else {
			logger.error('Error adding FAQ:', await ris.text());
		}
	}

	async function updateFAQ(faq:FAQ) {
		logger.log('FAQ aggiornata:', faq);
		const ris = await fetch(`/api/faqs`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(faq)
		});
		if (ris.ok) {
			logger.log('FAQ aggiornata');
			await invalidateAll();
			const foundFaq = faqs.find((f) => String(f._id) === String(faq.id));
			if (foundFaq) {
				foundFaq.question = faq.question;
				foundFaq.answer = faq.answer;
				foundFaq.title = faq.title;
			}
			showUpdateFAQ = false;
		} else {
			logger.error('Error updating FAQ:', await ris.text());
		}
	}

	async function deleteFAQ(form: any) {
		logger.log('FAQ eliminata', form.get('id'));
		const ris = await fetch(`/api/faqs`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id: form.get('id'),
				current_password: form.get('current_password')
			})
		});
		if (ris.ok) {
			faqs = faqs.filter((f) => f._id !== form.get('id'));
			await invalidateAll();
			showDeleteFAQ = false;
			editingFAQ = null;
			logger.log('FAQ eliminata');
		} else {
			logger.error('Error deleting FAQ:', await ris.text());
		}
	}

	function handleModalCancel() {
		showNewFAQ = false;
		showUpdateFAQ = false;
		showDeleteFAQ = false;
		editingFAQ = null;
	}

	function handleEditFaq(faq: any) {
		editingFAQ = faq;
		showUpdateFAQ = true;
	}

	function handleDeleteFaq(faq: any) {
		editingFAQ = faq;
		showDeleteFAQ = true;
	}
</script>

<div class="grid-home mx-auto grid h-dvh max-w-xl">
	<HeaderPages {data} title="Gestione FAQ" />

	{#if showNewFAQ}
		<Faq onSubmitFaq={newFAQ} onCancel={handleModalCancel} />
	{/if}

	{#if showUpdateFAQ}
		<UpdateFaq faq={editingFAQ} onSubmitFaq={updateFAQ} onCancel={handleModalCancel} />
	{/if}
	{#if showDeleteFAQ}
		<DeleteFaq faq={editingFAQ} onSubmitFaq={deleteFAQ} onCancel={handleModalCancel} />
	{/if}

	<main class="flex flex-grow flex-col">
		<div
			class="scroll-snap-y-container flex max-h-[calc(100vh-17em)] flex-col gap-2 overflow-y-auto px-4"
		>
			{#if filteredFaq.length > 0}
				{#each filteredFaq as faq (faq._id)}
					<FaqItem
						{faq}
						open={selectedFaqId === faq._id}
						onToggle={() => toggleFaq(faq)}
						onEdit={() => handleEditFaq(faq)}
						onDelete={() => handleDeleteFaq(faq)}
					/>
				{/each}
			{:else}
				<p class="text-gray py-16 text-center">Ancora nessuna FAQ</p>
			{/if}
		</div>

		<!-- Ricerca + Nuova FAQ -->
		<div class="rounded-t-3xl bg-white p-4">
			<div class="mb-4 flex items-center justify-between">
				<div class="relative mr-4 flex-grow">
					<input
						type="text"
						bind:value={query}
						placeholder="Cerca FAQ..."
						class="w-full rounded-full border border-gray-300 bg-white py-2 pl-10 pr-4 placeholder:opacity-50"
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
