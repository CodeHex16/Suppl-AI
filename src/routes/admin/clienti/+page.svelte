<script lang="ts">
	import { ArrowLeft, Search, Ellipsis, Plus } from 'lucide-svelte';
	import BottomNavBar from '$lib/components/BottomNavBar.svelte';
	import UserItem from '$lib/components/User.svelte';
	import Modal from '$lib/components/NewUserModal.svelte';
	import UpdateModal from '$lib/components/UpdateUserModal.svelte';
	import HeaderPages from '$lib/components/HeaderPages.svelte';
	import DeleteUserConfirmModal from '$lib/components/DeleteUserConfirmModal.svelte';
	import { error } from '@sveltejs/kit';

	let { data } = $props();
	let users = $state(data.users ?? []);
	let showModalNew = $state(false);
	let showModalDeleteUserConfirm = $state(false);

	let showModalUpdate = $state(false);
	let editingUser = $state<any>(null);
	let errorMessage = $state<string | null>(null);

	let query = $state('');
	let selectedUser = $state<string | null>(null);

	function toggleUser(email: string) {
		selectedUser = selectedUser === email ? null : email;
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
			users = [...users, user];
			showModalNew = false;
			errorMessage = null;
		} else {
			let risText = await ris.json();
			errorMessage = risText.error;
			console.error('Error adding user:', errorMessage);
		}
	}

	async function updateUser(user: any) {
		users = users.map((u) => (u.email === user.email ? { ...u, ...user } : u));
		console.log('Updating user:', user);
		const ris = await fetch(`/api/users`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(user)
		});
		if (ris.ok) {
			const updatedUser = await ris.json();
			users = users.map((u) => (u.email === updatedUser.email ? updatedUser : u));
			showModalUpdate = false;
			editingUser = null;
			selectedUser = null;
			errorMessage = null;
		} else {
			let risText = await ris.json();
			errorMessage = risText.error;

			console.error('Error updating user:', errorMessage);
		}
	}

	function openDeleteUserConfirm() {
		showModalDeleteUserConfirm = true;
	}
</script>

<div class="grid-home mx-auto grid h-dvh max-w-xl">
	<HeaderPages {data} title="Gestione clienti" />
	{#if showModalDeleteUserConfirm}
		<DeleteUserConfirmModal
			user={editingUser}
			onCancel={() => (showModalDeleteUserConfirm = false)}
			onSubmitUser={() => {
				users = users.filter((u) => u.email !== editingUser.email);
				showModalDeleteUserConfirm = false;
				editingUser = null;
			}}
		/>
	{/if}

	{#if showModalNew}
		<Modal
			onSubmitUser={(user) => newUser(user)}
			onCancel={() => {
				showModalNew = false;
				errorMessage = null;
			}}
			{errorMessage}
		/>
	{/if}

	{#if showModalUpdate}
		<UpdateModal
			user={editingUser}
			onSubmitUser={(user) => updateUser(user)}
			onCancel={() => {
				showModalUpdate = false;
				editingUser = null;
				errorMessage = null;
			}}
			{errorMessage}
		/>
	{/if}

	<main class="flex flex-col overflow-hidden pt-2">
		<div
			class="scroll-snap-y-container flex max-h-[calc(100vh-17em)] flex-col gap-2 overflow-y-auto"
		>
			{#if users.length === 0}
				<p class="mt-10 text-center text-gray-500">Nessun utente trovato.</p>
			{/if}

			{#if utentiFiltrati.length > 0}
				{#each utentiFiltrati as user (user.email)}
					<UserItem
						{user}
						open={selectedUser === user.email}
						onToggle={() => toggleUser(user.email)}
						onEdit={() => {
							editingUser = user;
							showModalUpdate = true;
						}}
						onDelete={() => {
							editingUser = user;
							openDeleteUserConfirm();
						}}
					/>
				{/each}
			{:else}
				<p class="text-gray p-8 text-center">Ancora nessun cliente</p>
			{/if}
		</div>

		<div class="shaadow-md rounded-t-3xl bg-white p-4">
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
