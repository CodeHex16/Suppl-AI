<script lang="ts">
	import { ArrowLeft, Search, Ellipsis, Plus, Mail, Tag } from 'lucide-svelte';
	import BottomNavBar from '$lib/components/BottomNavBar.svelte';
	import HeaderPages from '$lib/components/HeaderPages.svelte';
	import { goto } from '$app/navigation';
	import { logger } from '$lib/utils/logger';

	let { data }:{
		data: {
			theme: string;
			title: string;
			subtitle: string;
		}
	} = $props();

	let stats = $state([]);
	let startDate = $state('');
	let endDate = $state('');

	async function getStats() {
		logger.log('Richiesta statistiche...');
		const res = await fetch('/api/get_stats', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				startDate: startDate,
				endDate: endDate
			})
		});
		logger.log('Risposta ricevuta:', res);

		const data_json = await res.json();
		if (!data_json.error) {
			logger.log('Statistiche ricevute:', data_json.stats);
			stats = data_json.stats;
			logger.log('Statistiche:', data_json.stats);
		} else {
			logger.error('Errore nella richiesta delle statistiche:', data_json.error);
		}
	}

	$effect(() => {
		const url = new URL(window.location.href);
		startDate = url.searchParams.get('startDate') || '';
		endDate = url.searchParams.get('endDate') || '';
	});

	$effect(async () => {
		const params = new URLSearchParams();
		if (startDate) params.set('startDate', startDate);
		if (endDate) params.set('endDate', endDate);

		await goto(`?${params.toString()}`, { replaceState: true, keepfocus: true, noscroll: true });

		getStats();
	});
</script>

<div class="grid-home mx-auto grid h-dvh max-w-xl grid-rows-[auto_1fr_auto]">
	<HeaderPages {data} title="Statistiche" />

	<main class="flex flex-col overflow-hidden pt-2">
		<div class="flex-grow overflow-y-auto p-4">
			<div class="flex flex-col gap-4">
				<div class="rounded-xl bg-white p-4 shadow-md">
					<h3 class="mb-2 text-lg font-semibold">Messaggi totali</h3>
					<div class="flex flex-row flex-wrap items-end">
						<p class="text-2xl font-bold">{stats.total_messages || 0}</p>
						<p class="text-l pl-0 pt-1 sm:pl-4 sm:pt-0">
							({stats.total_chatbot_messages || 0} chatbot - {stats.total_user_messages || 0} utente)
						</p>
					</div>
				</div>
				<div class="rounded-xl bg-white p-4 shadow-md">
					<h3 class="mb-2 text-lg font-semibold">Chat totali</h3>
					<p class="text-2xl font-bold">{stats['total_chats'] || 0}</p>
				</div>
				<div class="rounded-xl bg-white p-4 shadow-md">
					<h3 class="mb-2 text-lg font-semibold">Percentuale valutazioni positive</h3>
					<div class="flex flex-row flex-wrap items-end">
						<p class="text-2xl font-bold">{stats.positive_rating_percentage || 0}%</p>
						<p class="text-l pl-0 pt-1 sm:pl-4 sm:pt-0">
							(su {stats.total_rated_messages || 0} messaggi valutati)
						</p>
					</div>
				</div>
				<div class="rounded-xl bg-white p-4 shadow-md">
					<h3 class="mb-2 text-lg font-semibold">Utenti attivi</h3>
					<p class="text-2xl font-bold">{stats.active_users || 0}</p>
				</div>
				<div class="rounded-xl bg-white p-4 shadow-md">
					<h3 class="mb-2 text-lg font-semibold">Media messaggi per chat</h3>
					<p class="text-2xl font-bold">{stats.average_messages_per_chat || 0}</p>
				</div>
				<div class="rounded-xl bg-white p-4 shadow-md">
					<h3 class="mb-2 text-lg font-semibold">Media messaggi per utente</h3>
					<p class="text-2xl font-bold">{stats.average_messages_per_user || 0}</p>
				</div>
			</div>
		</div>

		<div class="mt-auto rounded-t-3xl bg-white p-4 pb-8 shadow-md">
			<form>
				<div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
					<div class="relative flex-grow">
						<label class="block p-2" for="startDate">Data inizio</label>
						<input
							id="startDate"
							name="startDate"
							bind:value={startDate}
							type="date"
							class="w-full rounded-full border border-gray-300 bg-white py-2 pl-4 pr-4"
						/>
					</div>
					<div class="relative mt-2 flex-grow sm:mt-0">
						<label class="block p-2" for="endDate">Data fine</label>
						<input
							id="endDate"
							name="endDate"
							bind:value={endDate}
							type="date"
							class="w-full rounded-full border border-gray-300 bg-white py-2 pl-4 pr-4"
						/>
					</div>
				</div>
			</form>
		</div>
	</main>

	<BottomNavBar {data} />
</div>
