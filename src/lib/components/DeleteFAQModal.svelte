<script lang="ts">
	import { enhance, applyAction } from '$app/forms'; // Importa applyAction
	import { invalidateAll } from '$app/navigation'; // Importa invalidateAll per aggiornare i dati dopo l'eliminazione
	import { type Faq } from '$lib/types'; // Importa il tipo FAQ
	let {
		faq,
		onCancel,
		onSubmitFaq,
		errorMessage
	}: {
		faq: Faq;
		onCancel: () => void;
		onSubmitFaq: (formData: FormData) => Promise<void>;
		errorMessage: string | null;
	} = $props();
	const handleFormSubmit = async (event: Event) => {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);
		onSubmitFaq(formData);
	};

</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
	<div class="w-[90%] max-w-md rounded-xl bg-white p-6 shadow-xl">
		<div class="flex flex-col items-center justify-center">
			<h2 class="text-lg font-semibold">Conferma Eliminazione</h2>

			{#if errorMessage}
			<p class="text-center text-red-500">{errorMessage}</p>
			{/if}
			<p class="my-2 break-words text-center overflow-hidden max-w-56">Sei sicuro di voler eliminare la FAQ "{faq.title}"?</p>
			<form onsubmit={handleFormSubmit}>
				<input type="hidden" name="id" value={faq._id} />
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
