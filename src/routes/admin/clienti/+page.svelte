<script lang="ts">
	import { ArrowLeft, Search, Ellipsis, Plus } from 'lucide-svelte';
	import BottomNavBar from '$lib/components/BottomNavBar.svelte';
	import UserItem from '$lib/components/User.svelte';
	import Modal from '$lib/components/NewUserModal.svelte';
	import UpdateModal from '$lib/components/UpdateUserModal.svelte';
	import HeaderPages from '$lib/components/HeaderPages.svelte';
	import DeleteUserConfirmModal from '$lib/components/DeleteUserConfirmModal.svelte';

	let { data } = $props();
	let users = $state(data.users ?? []);
	$inspect(users);
	let showModalNew = $state(false);

	let showModalUpdate = $state(false);
	let editingUser = $state<any>(null);

	let query = $state('');
	let selectedUser = $state<string | null>(null);

	function toggleUser(email: string) {
		selectedUser = selectedUser === email ? null : email;
		console.log(selectedUser);
	}

	const utentiFiltrati = $derived(
		users.filter(
			(doc) =>
				doc.name.toLowerCase().trim().includes(query.toLowerCase().trim()) ||
				doc.role.toLowerCase().trim().includes(query.toLowerCase().trim()) ||
				doc.email.toLowerCase().trim().includes(query.toLowerCase().trim())
		)
	);

	async function newUser(user: any) {
		console.log('Nuovo utente aggiunto:', user);
		const ris = await fetch('/api/users', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(user)
		});
		if (ris.ok) {
			const newUser = await ris.json();
			users = [...users, newUser.user];
		} else {
			console.error('Error adding user:', await ris.text());
		}
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

	function openDeleteUserConfirm() {
		showModalDeleteUserConfirm.set(true);
	}
</script>

<div class="grid-home mx-auto grid h-dvh max-w-xl">
	<HeaderPages {data} title="Gestione utenti" />
	{#if $showModalDeleteUserConfirm}
	<DeleteUserConfirmModal
		user={$editingUser}
		on:cancel={() => showModalDeleteUserConfirm.set(false)}
	/>
{/if}

{#if showModalNew}
<Modal onSubmitUser={(user) => newUser(user)} onCancel={() => (showModalNew = false)} />
{/if}

	{#if showModalUpdate}
		<UpdateModal
			user={editingUser}
			onSubmitUser={(user) => updateUser(user)}
			onCancel={() => {
				showModalUpdate = false;
				editingUser = null;
			}}
		/>
	{/if}

	<main class="flex flex-col overflow-hidden pt-2">
		<div
			class="scroll-snap-y-container flex max-h-[calc(100vh-18em)] flex-col gap-2 overflow-y-auto"
		>
			{#if users.length === 0}
				<p class="mt-10 text-center text-gray-500">Nessun utente trovato.</p>
			{/if}
			{#if selectedUser === 'all'}
				<UserItem
					user={{ name: 'Tutti gli utenti', email: 'all', role: 'all' }}
					open={true}
					onToggle={() => toggleUser('all')}
					onEdit={(editedUser) => {
						editingUser = editedUser;
						showModalUpdate = true;
					}}
				/>
			{/if}

			{#if utentiFiltrati.length > 0}
				{#each utentiFiltrati as user (user.email)}
					<UserItem
						{user}
						open={selectedUser === user.email}
						onToggle={() => toggleUser(user.email)}
						onEdit={(editedUser) => {
							editingUser = editedUser;
							showModalUpdate = true;
						}}
					/>
				{/each}
			{:else}
				<p class="mt-10 text-center text-gray-500">Nessun utente trovato.</p>
			{/if}
		</div>

		<div class="rounded-t-3xl bg-white p-4 shadow-md">
			<div class="mb-4 flex items-center justify-between">
				<div class="relative mr-4 flex-grow">
					<input
						type="text"
						bind:value={query}
						placeholder="Cerca utenti..."
						class="w-full rounded-full border border-gray-300 bg-white py-2 pl-10 pr-4 placeholder:opacity-50"
					/>
					<Search class="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
				</div>
				<button
					onclick={() => (showModalNew = true)}
					class="item-primary flex h-12 w-12 items-center justify-center rounded-full transition duration-150 ease-in"
				>
					<Plus />
				</button>
			</div>
		</div>
	</main>

	<BottomNavBar {data} />
</div>
