<script lang="ts">
	// Import necessary icons
	import { User, Mail, Tag, LockKeyhole } from 'lucide-svelte';
	import { type User as UserType } from '$lib/types';
	import { logger } from '$lib/utils/logger';

	let { user, onSubmitUser, onCancel, errorMessage } = $props<{
		user: UserType;
		onSubmitUser: (user: UserType, password: string) => void;
		onCancel: () => void;
		errorMessage: string | null;
	}>();


	let name = $state(user.name);
	let role = $state(user.role);
	let password = $state('');
	logger.log('Editing user:', user);
	let email = $state(user.email);

	function submitForm() {
		if (!name  || !role || !password) {
			logger.error('All fields are required');
			return;
		}
		const userAfterEdit = {
			name,
			email,
			role
		};
		onSubmitUser(userAfterEdit, password);

	}
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
	<div class="w-[90%] max-w-md rounded-xl bg-white p-6 shadow-xl">
		<h2 class="mb-4 text-center text-lg font-semibold">Modifica Utente</h2>

		{#if errorMessage}
			<p class="mb-4 text-center text-red-500">{errorMessage}</p>
		{/if}

		<div class="relative mb-3">
			<User class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
			<input
				type="text"
				bind:value={name}
				placeholder="Nome"
				required
				class="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
		</div>

		<div class="relative mb-4">
			<Tag class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
			<select
				bind:value={role}
				required
				class="w-full appearance-none rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
			>
				<option value="" disabled selected>Seleziona un ruolo</option>
				<option value="admin">Admin</option>
				<option value="user">User</option>
			</select>
		</div>
		<!-- Password Input with Icon -->
		<div class="relative mb-3">
		
			<LockKeyhole class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
			<input
				id="password"
				type="password"
				bind:value={password}
				placeholder="Admin Password"
				required
				class="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
		</div>

		<div class="mt-4 flex justify-center gap-4">
			<button
				class="bg-gray rounded-full px-4 py-2"
				type="button"
				aria-label="Cancel"
				title="Annulla"
				onclick={onCancel}>Annulla</button
			>
			<button
				class="item-primary rounded-full px-4 py-2"
				type="submit"
				aria-label="Confirm"
				onclick={submitForm}
				disabled={!name || !email || !role || !password}
				title="Conferma">Conferma</button
			>
		</div>
	</div>
</div>
