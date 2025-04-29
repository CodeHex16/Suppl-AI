<script lang="ts">
	import { ArrowLeft, Search, Ellipsis, Plus } from 'lucide-svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import BottomNavBar from '$lib/components/BottomNavBar.svelte';
	import UserItem from '$lib/components/User.svelte';
	import Modal from '$lib/components/NewUserModal.svelte';
	import UpdateModal from '$lib/components/UpdateUserModal.svelte';
	import HeaderPages from '$lib/components/HeaderPages.svelte';

	let { data } = $props();
	let users = $state(data.users ?? []);
	let showModalNew = $state(false);

	let showModalUpdate = $state(false);
	let editingUser = $state<any>(null); // o tipo User se l'hai tipizzato

	let query = $state('');
	let selectedUser = $state<number | null>(null);

	function toggleUser(id: number) {
		selectedUser = selectedUser === id ? null : id;
		console.log(selectedUser)
	}

	const utentiFiltrati = $derived(
		users.filter((doc) =>
			doc.name.toLowerCase().includes(query.toLowerCase()) ||
			doc.role.toLowerCase().includes(query.toLowerCase()) ||
			doc.email.toLowerCase().includes(query.toLowerCase())
		)
	);

	function newUser(user: any) {
		console.log('Nuovo utente aggiunto:', user); // 👈 Log del nuovo utente
		users = [...users, { id: Date.now(), ...user }];
		showModalNew = false;
	}

	function updateUser(user: any) {
		console.log('Utente aggiornato (input):', user); // 👈 Log prima dell'update

		users = users.map((u) => (u.id === user.id ? { ...u, ...user } : u));
		console.log('Lista utenti aggiornata:', users); // 👈 Log della lista aggiornata

		// Log finale dello store `users` (assicurati che venga aggiornato)
		console.log('Valore attuale dello stato `users`:', users);

		showModalUpdate = false;
		editingUser = null;
	}

</script>

<div class="grid-home mx-auto grid h-dvh max-w-xl">
	<HeaderPages {data} title="Gestione utenti" />

	{#if showModalNew}
		<Modal
			on:submitUser={(e) => newUser(e.detail)}
			on:cancel={() => showModalNew = false}
		/>
	{/if}

	{#if showModalUpdate}
	<UpdateModal
		user={editingUser}
		on:submitUser={(e) => updateUser(e.detail)}
		on:cancel={() => {
			showModalUpdate = false;
			editingUser = null;
		}}
	/>
{/if}


	<main class="flex flex-col pt-2 flex-grow">
		<!-- Barra di ricerca e pulsante per nuovo utente -->


		<!-- Lista utenti -->
		{#if utentiFiltrati.length > 0}
			{#each utentiFiltrati as user (user.id)}
				<UserItem
					{user}
					open={selectedUser === user.id}
					on:toggle={() => toggleUser(user.id)}
					on:edit={(e) => {
						editingUser = e.detail;
						showModalUpdate = true;
					}}
				/>

			{/each}
		{:else}
			<p class="text-center text-gray-500 mt-10">Nessun utente trovato.</p>
		{/if}

        <div class="rounded-t-3xl bg-white p-4 shadow-md">
            <div class="flex justify-between items-center mb-4">
                <div class="relative flex-grow mr-4">
                    <input
                        type="text"
                        bind:value={query}
                        placeholder="Cerca utenti..."
                        class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white"
                    />
                    <Search class="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
                </div>
				<button
					onclick={() => showModalNew = true}
                    class="flex items-center justify-center h-12 w-12 rounded-full item-primary transition duration-150 ease-in"
                >
                    <Plus />
                </button>
            </div>
        </div>
	</main>

	<BottomNavBar {data} />
</div>
