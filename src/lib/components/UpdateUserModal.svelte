<script lang="ts">
    import { type Writable, writable, derived } from 'svelte/store';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

    let { user } = $props();

	let id = user.id;
	let name = user.name;
	let email = user.email;
	let role = user.role;
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
		<h2 class="text-lg font-semibold mb-4">Nuovo Utente</h2>

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
			<button class="px-4 py-2 rounded-lg bg-gray-300 text-white transition duration-150 ease-in hover:bg-gray-400" on:click={() => dispatch('cancel')}>Annulla</button>
			<button class="px-4 py-2 rounded-lg bg-blue-500 text-white transition duration-150 ease-in hover:bg-blue-600" on:click={submitForm}>Salva</button>
		</div>
	</div>
</div>
