<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { enhance } from '$app/forms';
	let { user } = $props();
	let name = user.name;
	const dispatch = createEventDispatcher();
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
	<div class="w-[90%] max-w-md rounded-xl bg-white p-6 shadow-xl">
		<div class="flex flex-col items-center justify-center">
			<h2 class="mb-2 text-lg font-semibold">Conferma Eliminazione</h2>
			<p class="mb-2 mt-2">Sei sicuro di cancellare l'utente "{name}"?</p>
			<form method="POST" use:enhance>
				<input
					type="password"
					id="password"
					name="password"
					placeholder="Inserisci la tua password"
					value="testtest"
					required
					class="rounded-full border-none bg-gray-100 px-4 py-2"
				/>

				<div class="mt-2 flex flex-row justify-self-center">
					<button
						class="item-primary hover:bg-primary/80 mr-2 rounded-full p-2"
						type="button"
						aria-label="Confirm"
						title="Conferma"
						>Conferma</button
					>
					<button
						class="mr-2 rounded-full bg-gray-100 p-2 hover:bg-gray-200"
						type="button"
						aria-label="Cancel"
						title="Annulla"
						onclick={() => dispatch('cancel')}>Annulla</button
					>
				</div>
			</form>
		</div>
	</div>
</div>
