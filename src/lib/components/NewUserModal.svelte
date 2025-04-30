<script lang="ts">
	let { onSubmitUser, onCancel } = $props<{
		onSubmitUser: (user: {
			name: string;
			email: string;
			role: string;
			creationDate: string;
		}) => void;
		onCancel: () => void;
	}>();

	let name = $state('');
	let email = $state('');
	let role = $state('');

	function submitForm() {
		onSubmitUser({
			name,
			email,
			role,
			creationDate: new Date().toISOString()
		});
	}
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
	<div class="w-[90%] max-w-md rounded-xl bg-white p-6 shadow-xl">
		<h2 class="mb-4 text-lg font-semibold">Nuovo Utente</h2>

		<div class="mb-3">
			<input
				type="text"
				bind:value={name}
				placeholder="Nome"
				required
				class="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
		</div>
		<div class="mb-3">
			<input
				type="email"
				bind:value={email}
				placeholder="Email"
				required
				class="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
		</div>
		<div class="mb-4">
			<select
				bind:value={role}
				required
				class="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
			>
				<option value="" disabled selected>Seleziona un ruolo</option>
				<option value="admin">Admin</option>
				<option value="user">User</option>
			</select>
		</div>

		<div class="flex justify-end space-x-2">
			<!-- Call the onCancel callback prop directly -->
			<button
				class="bg-gray rounded-lg px-4 py-2 transition duration-150 ease-in"
				onclick={onCancel}>Annulla</button
			>
			<button
				class="item-primary rounded-lg px-4 py-2 transition duration-150 ease-in"
				onclick={submitForm}>Salva</button
			>
		</div>
	</div>
</div>
