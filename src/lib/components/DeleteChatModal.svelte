<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { logger } from '$lib/utils/logger';
	let {
		chatName,
		chatId,
		onCancel
	}: {
		chatName: string;
		chatId: string;
		onCancel: () => void;
	} = $props();

	async function handleSubmit(event: Event) {
		event.preventDefault();
		logger.info('Eliminazione chat in corso...');

		const form = event.currentTarget as HTMLFormElement;
		const formData = new FormData(form);
		logger.info('FormData:', formData);

		try {
			const res = await fetch("/?/deleteChat", {
				method: 'POST',
				body: formData
			});

			if (res.ok) {
				logger.info('Chat eliminata con successo');
				onCancel();
				await invalidateAll();
				goto('/');
			} else {
				logger.error("Errore durante l'eliminazione della chat:", await res.text());
				alert("Si è verificato un errore durante l'eliminazione della chat. Riprova.");
			}
		} catch (err) {
			logger.error("Errore di rete:", err);
			alert("Errore di rete. Riprova più tardi.");
		}
	}
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
					data-testid="delete-chat-form"
					method="POST"
					onsubmit={handleSubmit}
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
