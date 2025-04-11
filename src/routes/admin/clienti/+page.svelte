<script lang="ts">
	import { ArrowLeft, Search, Ellipsis, Plus } from 'lucide-svelte';
	import BottomNavBar from '$lib/components/BottomNavBar.svelte';
	import UserItem from '$lib/components/User.svelte';
	import Modal from '$lib/components/NewUserModal.svelte';
	import UpdateModal from '$lib/components/UpdateUserModal.svelte';
	import { writable, derived } from 'svelte/store';

	let { data } = $props();
	const users = writable(data.users ?? []);
	const showModalNew = writable(false);

	const showModalUpdate = writable(false);
	const editingUser = writable<any>(null); // o tipo User se l'hai tipizzato

	const query = writable('');
	const selectedUser = writable<number | null>(null);

	function toggleUser(id: number) {
		selectedUser.update((current) => (current === id ? null : id));
		console.log(selectedUser)
	}

	const utentiFiltrati = derived([query, users], ([$query, $users]) =>
		$users.filter((doc) =>
			doc.name.toLowerCase().includes($query.toLowerCase()) ||
			doc.role.toLowerCase().includes($query.toLowerCase()) ||
			doc.email.toLowerCase().includes($query.toLowerCase())
		)
	);

	function newUser(user: any) {
		console.log('Nuovo utente aggiunto:', user); // 👈 Log del nuovo utente
		users.update(prev => [...prev, { id: Date.now(), ...user }]);
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

</script>

<div class="grid-home mx-auto grid h-dvh max-w-xl">
	<header class="mt-4">
		<nav class="grid grid-cols-3 items-center px-4">
			<a href="/">
				<div class="h-12 w-12 justify-self-start rounded-full bg-white p-3 hover:bg-gray-100 transition">
					<ArrowLeft />
				</div>
			</a>
			<h1 class="text-center text-lg font-semibold">Gestione utenti</h1>
			<div class="h-12 w-12 justify-self-end rounded-full bg-white p-3 hover:bg-gray-100 transition">
				<Ellipsis />
			</div>
		</nav>
	</header>

	{#if $showModalNew}
		<Modal
			on:submitUser={(e) => newUser(e.detail)}
			on:cancel={() => showModalNew.set(false)}
		/>
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


	<main class="flex flex-col pt-2 flex-grow overflow-y-auto">
		<!-- Barra di ricerca e pulsante per nuovo utente -->
		

		<!-- Lista utenti -->
		{#if $utentiFiltrati.length > 0}
			{#each $utentiFiltrati as user (user.id)}
				<UserItem
					{user}
					open={$selectedUser === user.id}
					on:toggle={() => toggleUser(user.id)}
					on:edit={(e) => {
						editingUser.set(e.detail);
						showModalUpdate.set(true);
					}}
				/>
			
			{/each}
		{:else}
			<p class="text-center text-gray-500 mt-10">Nessun utente trovato.</p>
		{/if}

        <div class="rounded-t-3xl bg-white p-4">
            <div class="flex justify-between items-center mb-4">
                <div class="relative flex-grow mr-4">
                    <input
                        type="text"
                        bind:value={$query}
                        placeholder="Cerca utenti..."
                        class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                    <Search class="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
                </div>
				<button
					on:click={() => showModalNew.set(true)}
                    class="flex items-center justify-center h-12 w-12 rounded-full bg-blue-500 text-white transition duration-150 ease-in hover:bg-blue-600"
                >
                    <Plus />
                </button>
            </div>
        </div>
	</main>

	<BottomNavBar {data} />
</div>
