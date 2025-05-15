<script lang="ts">
	import { invalidateAll } from '$app/navigation'; // Importa invalidateAll per aggiornare i dati dopo l'eliminazione
	import { type User } from '$lib/types'; // Importa il tipo User
	import { logger } from '$lib/utils/logger';
	let {
		user,
		onCancel,
		onSubmitUser
	}: {
		user: User;
		onCancel: () => void;
		onSubmitUser: () => void;
	} = $props();

	// Funzione per gestire l'invio manuale
	async function handleDeleteSubmit(event: Event) {
		event.preventDefault(); // Previene il comportamento predefinito del form
		const formData = new FormData(event.target as HTMLFormElement); // Crea un oggetto FormData dal form
		const currentPassword = formData.get('current_password');

		try {
			const response = await fetch("/api/users", {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					// Invia i dati come JSON
					userId: user.email,
					current_password: currentPassword
				})
			});

			logger.log('Risposta:', response);

			if (response.ok) {
				logger.log('Utente eliminato con successo:', user.email);
				invalidateAll();
				onSubmitUser();
			} else {
				// Errore dal server (es. password errata)
				const errorData = await response.json();
				logger.error("Errore durante l'eliminazione dell'utente:", errorData);
				if(errorData.error === 'Unauthorized') {
					alert('Password errata. Riprova.');
				} else {
					alert('Si è verificato un errore durante l\'eliminazione dell\'utente. Riprova.');
				}
			}
		} catch (error) {
			// Errore di rete o altro errore imprevisto
			logger.error('Errore di rete o imprevisto:', error);
			alert('Si è verificato un errore di rete. Riprova.');
		}
	}
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
	<div class="w-[90%] max-w-md rounded-xl bg-white p-6 shadow-xl">
		<div class="flex flex-col items-center justify-center">
			<h2 class="text-lg font-semibold">Conferma Eliminazione</h2>
			<p class="my-2">Sei sicuro di voler eliminare l'utente "{user.name}"?</p>
			<form method="POST" onsubmit={handleDeleteSubmit}>
				<div class="text-center">
					<label for="password">Inserisci la tua password per confermare</label>
					<input
						type="password"
						id="password"
						name="current_password"
						placeholder="Inserisci la tua password"
						required
						class="bg-gray mt-2 w-full rounded-full border px-4 py-2 placeholder:opacity-50"
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
						title="Conferma">Conferma</button
					>
				</div>
			</form>
		</div>
	</div>
</div>
