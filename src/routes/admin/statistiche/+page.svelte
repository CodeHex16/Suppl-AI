<script lang="ts">
	import { ArrowLeft, Search, Ellipsis, Plus, Mail, Tag } from 'lucide-svelte';
	import BottomNavBar from '$lib/components/BottomNavBar.svelte';
	import HeaderPages from '$lib/components/HeaderPages.svelte';
	import { goto } from '$app/navigation';

	let { data } = $props();
	let stats = $state([]);
	let startDate = $state('');
	let endDate = $state('');

	async function getStats() {
		const res = await fetch('/api/get_stats', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				startDate: startDate,
				endDate: endDate
			})
		});

		const data_json = await res.json();
		if (!data_json.error) {
			stats = data_json.stats;
			console.log('Statistiche:', data_json.stats);
		} else {
			console.error('Errore nella richiesta delle statistiche:', data_json.error);
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

<div class="grid-home mx-auto grid h-dvh max-w-xl">
	<HeaderPages {data} title="Statistiche" />

	<main class="flex flex-col pt-2 flex-grow">
		<div class="scroll-snap-y-container flex max-h-[calc(100vh-19em)] flex-col gap-2 overflow-y-auto">
			<div class="mx-4 mb-4 rounded-xl bg-white p-4 shadow-md">
				<h3 class="text-lg font-semibold mb-2">Messaggi totali</h3>
				<div class="flex flex-row items-end">
					<p class="text-2xl font-bold">{stats.total_messages}</p>
					<p class="text-l font-bold pl-4">({stats.total_chatbot_messages} chatbot - {stats.total_user_messages} utente)</p>
				</div>	
			</div>
			<div class="mx-4 mb-4 rounded-xl bg-white p-4 shadow-md">
				<h3 class="text-lg font-semibold mb-2">Chat totali</h3>
				<p class="text-2xl font-bold">{stats['total_chats']}</p>
			</div>
			<div class="mx-4 mb-4 rounded-xl bg-white p-4 shadow-md">
				<h3 class="text-lg font-semibold mb-2">Percentuale valutazioni positive</h3>
				<div class="flex flex-row items-end">
					<p class="text-2xl font-bold">{stats.positive_rating_percentage}%</p>
					<p class="text-l font-bold pl-4">(su {stats.total_rated_messages} messaggi valutati)</p>
				</div>				
			</div>
			<div class="mx-4 mb-4 rounded-xl bg-white p-4 shadow-md">
				<h3 class="text-lg font-semibold mb-2">Utenti attivi</h3>
				<p class="text-2xl font-bold">{stats.active_users}</p>
			</div>
			<div class="mx-4 mb-4 rounded-xl bg-white p-4 shadow-md">
				<h3 class="text-lg font-semibold mb-2">Media messaggi per chat</h3>
				<p class="text-2xl font-bold">{stats.average_messages_per_chat}</p>
			</div>
			<div class="mx-4 mb-4 rounded-xl bg-white p-4 shadow-md">
				<h3 class="text-lg font-semibold mb-2">Media messaggi per utente</h3>
				<p class="text-2xl font-bold">{stats.average_messages_per_user}</p>
			</div>
		</div>		

		<div class="rounded-t-3xl bg-white p-4 pb-8 shadow-md">
			<form>
				<div class="flex items-center justify-between g-2">
					<div class="relative mr-2 flex-grow">
						<label class="p-2" for="startDate">Data inizio</label>
						<input
							id="startDate"
							name="startDate"
							bind:value={startDate}
							type="date"
							class="w-full rounded-full border border-gray-300 bg-white py-2 pl-4 pr-4"
						/>
					</div>
					<div class="relative ml-2 flex-grow">
						<label class="p-2" for="endDate">Data fine</label>
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

	<BottomNavBar {data}/>
</div>
