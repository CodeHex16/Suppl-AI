<script lang="ts">
	import { enhance, applyAction } from '$app/forms'; // Importa applyAction
	import { invalidateAll } from '$app/navigation'; // Importa invalidateAll per aggiornare i dati dopo l'eliminazione

	let { user, onCancel, onSubmitUser } = $props();

	// Funzione per gestire l'invio manuale
	async function handleDeleteSubmit(formData: FormData, action: URL) {
		const userId = formData.get('userId');
		const currentPassword = formData.get('current_password');

		try {
			const response = await fetch(action, {
				method: 'DELETE', 
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					// Invia i dati come JSON
					userId: userId,
					current_password: currentPassword
				})
			});

			if (response.ok) {
				invalidateAll(); 
				onSubmitUser(); 
			} else {
				// Errore dal server (es. password errata)
				const errorData = await response.json();
				console.error("Errore durante l'eliminazione dell'utente:", errorData);
				if(errorData.error === 'Unauthorized') {
					alert('Password errata. Riprova.');
				} else {
					alert('Si è verificato un errore durante l\'eliminazione dell\'utente. Riprova.');
				}
			}
		} catch (error) {
			// Errore di rete o altro errore imprevisto
			console.error('Errore di rete o imprevisto:', error);
			await applyAction({ type: 'error', error });
			alert('Si è verificato un errore di rete. Riprova.');
		}
	}
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
	<div class="w-[90%] max-w-md rounded-xl bg-white p-6 shadow-xl">
		<div class="flex flex-col items-center justify-center">
			<h2 class="text-lg font-semibold">Conferma Eliminazione</h2>
			<p class="my-2 max-w-56 overflow-hidden text-ellipsis break-words text-center">Sei sicuro di voler eliminare l'utente "{user.name}"?</p>
			<form
				method="POST"
				action="/api/users"
				use:enhance={({ formData, action, cancel }) => {
					cancel();
					handleDeleteSubmit(formData, action);
				}}
			>
				<input type="hidden" name="userId" value={user.email} />
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
