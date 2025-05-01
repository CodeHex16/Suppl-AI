<script lang="ts">
	import { ArrowLeft, Search, Ellipsis, Plus } from 'lucide-svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import BottomNavBar from '$lib/components/BottomNavBar.svelte';
	import UserItem from '$lib/components/User.svelte';
	import Modal from '$lib/components/NewUserModal.svelte';
	import UpdateModal from '$lib/components/UpdateUserModal.svelte';
	import DeleteUserConfirmModal from '$lib/components/DeleteUserConfirmModal.svelte';
	import { writable, derived } from 'svelte/store';

	let { data } = $props();
	const users = writable(data.users ?? []);
	const showModalNew = writable(false);

	const showModalUpdate = writable(false);
	const editingUser = writable<any>(null); // o tipo User se l'hai tipizzato

	const query = writable('');
	const selectedUser = writable<number | null>(null);

	const showModalDeleteUserConfirm = writable(false);

	function toggleUser(id: number) {
		selectedUser.update((current) => (current === id ? null : id));
		console.log(selectedUser);
	}

	const utentiFiltrati = derived([query, users], ([$query, $users]) =>
		$users.filter(
			(doc) =>
				doc.name.toLowerCase().includes($query.toLowerCase()) ||
				doc.role.toLowerCase().includes($query.toLowerCase()) ||
				doc.email.toLowerCase().includes($query.toLowerCase())
		)
	);

	function newUser(user: any) {
		console.log('Nuovo utente aggiunto:', user); // 👈 Log del nuovo utente
		users.update((prev) => [...prev, { id: Date.now(), ...user }]);
		showModalNew.set(false);
	}

	function updateUser(user: any) {
		console.log('Utente aggiornato (input):', user); // 👈 Log prima dell'update

		users.update((list) => {
			const updatedList = list.map((u) => (u.id === user.id ? { ...u, ...user } : u));
			console.log('Lista utenti aggiornata:', updatedList); // 👈 Log della lista aggiornata
			return updatedList;
		});

		// Log finale dello store `users` (assicurati che venga aggiornato)
		users.subscribe((val) => {
			console.log('Valore attuale dello store `users`:', val);
		})();

		showModalUpdate.set(false);
		editingUser.set(null);
	}

	function openDeleteUserConfirm() {
		showModalDeleteUserConfirm.set(true);
	}
</script>

<div class="grid-home mx-auto grid h-dvh max-w-xl">
	<header class="mt-4">
		<nav class="grid grid-cols-3 items-center px-4">
			<a href="/">
				<div class="bg-gray h-12 w-12 justify-self-start rounded-full p-3 shadow-md transition">
					<ArrowLeft />
				</div>
			</a>
			<h1 class="text-center text-lg font-semibold">Gestione utenti</h1>
			<ThemeToggle />
		</nav>
	</header>
	{#if $showModalDeleteUserConfirm}
		<DeleteUserConfirmModal
			user={$editingUser}
			on:cancel={() => showModalDeleteUserConfirm.set(false)}
		/>
	{/if}

	{#if $showModalNew}
		<Modal on:submitUser={(e) => newUser(e.detail)} on:cancel={() => showModalNew.set(false)} />
	{/if}

	{#if $showModalUpdate}
		<UpdateModal
			user={$editingUser}
			on:submitUser={(e) => updateUser(e.detail)}
			on:cancel={() => {
				showModalUpdate.set(false);
				editingUser.set(null);
			}}
		/>
	{/if}

	<main class="flex flex-grow flex-col pt-2">
		<!-- Barra di ricerca e pulsante per nuovo utente -->

		<!-- Lista utenti -->
		{#if $utentiFiltrati.length > 0}
			{#each $utentiFiltrati as user (user.id)}
				<UserItem
					{user}
					open={$selectedUser === user.id}
					on:toggle={() => toggleUser(user.id)}
					on:delete={(e) => {
						editingUser.set(e.detail);
						openDeleteUserConfirm();
					}}
					on:edit={(e) => {
						editingUser.set(e.detail);
						showModalUpdate.set(true);
					}}
				/>
			{/each}
		{:else}
			<p class="mt-10 text-center text-gray-500">Nessun utente trovato.</p>
		{/if}

		<div class="rounded-t-3xl bg-white p-4 shadow-md">
			<div class="mb-4 flex items-center justify-between">
				<div class="relative mr-4 flex-grow">
					<input
						type="text"
						bind:value={$query}
						placeholder="Cerca utenti..."
						class="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4"
					/>
					<Search class="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
				</div>
				<button
					on:click={() => showModalNew.set(true)}
					class="item-primary flex h-12 w-12 items-center justify-center rounded-full transition duration-150 ease-in"
				>
					<Plus />
				</button>
			</div>
		</div>
	</main>

	<BottomNavBar {data} />
</div>
