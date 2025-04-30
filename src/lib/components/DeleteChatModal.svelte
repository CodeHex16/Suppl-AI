<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	let { chatName, chatId } = $props();
	const dispatch = createEventDispatcher();
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
	<div class="w-[90%] max-w-md rounded-xl bg-white p-6 shadow-xl">
		<div>
			<h2 class="mb-2 text-lg font-semibold">Conferma Eliminazione</h2>
			<p class="mb-2 mt-2">Sei sicuro di cancellare la chat "{chatName}"?</p>
			<div class="center mt-2 flex flex-row">
				<button
					class="mr-2 rounded-full bg-red-600 p-1 text-white hover:bg-red-600/80"
					type="button"
					aria-label="Delete chat"
					title="Elimina chat"
					on:click={() => dispatch('delete', chatId)}>Conferma</button
				>
				<button
					class="mr-2 rounded-full bg-gray-100 p-1 hover:bg-gray-200"
					type="button"
					aria-label="Cancel"
					title="Annulla"
					on:click={() => dispatch('cancel')}>Annulla</button
				>
			</div>
		</div>
	</div>
</div>
