<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { enhance } from '$app/forms';
	let { chatName, chatId } = $props();
	const dispatch = createEventDispatcher();
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
	<div class="w-[90%] max-w-md rounded-xl bg-white p-6 shadow-xl">
		<div class="flex flex-col items-center justify-center">
			<h2 class="mb-2 text-lg font-semibold">Conferma Eliminazione</h2>
			<p class="mb-2 mt-2">Sei sicuro di cancellare la chat "{chatName}"</p>
			<div class="mt-2 flex flex-row justify-self-center">
				<form method="POST" use:enhance action="/?/deleteChat">
					<input type="hidden" name="chat_id" value={chatId} />
					<button
						class="mr-2 rounded-full bg-red-600 p-2 text-white hover:bg-red-600/80"
						type="submit"
						aria-label="Delete chat"
						title="Elimina chat">Conferma</button
					>
				</form>
				<button
					class="mr-2 rounded-full bg-gray p-2"
					type="button"
					aria-label="Cancel"
					title="Annulla"
					onclick={() => dispatch('cancel')}>Annulla</button
				>
			</div>
		</div>
	</div>
</div>
