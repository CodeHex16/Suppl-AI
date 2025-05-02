<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { enhance } from '$app/forms';
    const dispatch = createEventDispatcher();

	let { document } = $props();

    let id = $state(document.id);
	let author = $state(document.author);
	let name = $state(document.name);
    let creationDate = $state(document.creationDate);

    function submitForm() {
		dispatch('submitDocument', {
			id,
			author,
			name,
			creationDate
		});
	}
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
	<div class="w-[90%] max-w-md rounded-xl bg-white p-6 shadow-xl">
		<div>
			<h2 class="mb-2 text-lg font-semibold">Conferma Eliminazione</h2>
			<p class="mb-2 mt-2">Sei sicuro di voler eliminare il documento "{name}"?</p>
			<div class="center mt-2 flex flex-row">
				<form method="POST" use:enhance>
					<input
						type="password"
						id="password"
						name="password"
						placeholder="Inserisci la tua password"
						required
						class="rounded-full border-none bg-gray-100 px-4 py-2"
					/>
	
					<div class="mt-2 flex flex-row justify-self-center">
						<button
							class="mr-2 rounded-full bg-red-600 p-1 text-white hover:bg-red-600/80"
							type="button"
							aria-label="Confirm"
							title="Conferma"
							onclick = {submitForm}>Conferma</button
						>
						<button
							class="mr-2 rounded-full bg-orange-600 p-1 hover:bg-orange-600/80"
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
</div>