<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto,  invalidateAll } from '$app/navigation';
	let { chatName, chatId, onCancel } = $props();
	console.log('chatName', chatName);
	console.log('chatId', chatId);
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
	<div class="w-[90%] max-w-md rounded-xl bg-white p-6 shadow-xl">
		<div class="flex flex-col items-center justify-center">
			<h2 class="mb-2 text-lg font-semibold">Conferma Eliminazione</h2>
			<p class="my-2 text-center">Sei sicuro di voler cancellare la chat "{chatName}"?</p>
			<div class="mt-2 flex flex-row gap-4 justify-self-center">
				<button
					class="bg-gray rounded-full px-4 py-2 transition ease-in"
					type="button"
					aria-label="Cancel"
					title="Annulla"
					onclick={onCancel}>Annulla</button
				>
				<form
					method="POST"
					action="/?/deleteChat"
					use:enhance={() => {
                        return async ({ result }) => {
                            if (result.type === 'success' || result.type === 'redirect') {
                                onCancel();
								invalidateAll();
								goto('/');
							} else if (result.type === 'error') {
								console.error('Errore durante l\'eliminazione della chat:', result.error);
								alert('Si è verificato un errore durante l\'eliminazione della chat. Riprova.');
							} else {
								console.warn('Risultato non previsto:', result);
                            } 
                        };
                    }}
				>
					<input type="hidden" name="chat_id" value={chatId} />
					<button
						class="rounded-full bg-red-600 px-4 py-2 text-white transition ease-in hover:bg-red-700"
						type="submit"
						aria-label="Delete chat"
						title="Elimina chat">Conferma</button
					>
				</form>
			</div>
		</div>
	</div>
</div>
