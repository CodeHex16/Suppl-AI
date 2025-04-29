<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

    let { user } = $props();

	let id = user.id;
	let name = $state(user.name);
	let email = $state(user.email);
	let role = $state(user.role);
    let creationDate = user.creationDate;

	function submitForm() {
		dispatch('submitUser', {
			id,
			name,
			email,
			role,
			creationDate
		});
	}
</script>

<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
	<div class="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-xl">
		<h2 class="text-lg font-semibold mb-4">Modifica Utente</h2>

		<div class="mb-3">
			<input type="text" bind:value={name} placeholder="Nome" required class="w-full pl-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
		</div>
		<div class="mb-3">
			<input type="email" bind:value={email} placeholder="Email" required class="w-full pl-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
		</div>
		<div class="mb-4">
            <select bind:value={role} required class="w-full pl-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="" disabled selected>Seleziona un ruolo</option>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
            </select>
		</div>

		<div class="flex justify-end space-x-2">
			<button class="px-4 py-2 rounded-lg bg-gray transition duration-150 ease-in" onclick={() => dispatch('cancel')}>Annulla</button>
			<button class="px-4 py-2 rounded-lg item-primary" onclick={submitForm}>Salva</button>
		</div>
	</div>
</div>
