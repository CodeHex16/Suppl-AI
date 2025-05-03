<script lang="ts">
	let { faq, onsubmitFaq, oncancel } = $props<{
		faq: any;
		onsubmitFaq: (faq: any) => void;
		oncancel: () => void;
	}>();

	let id = faq.id;
	let author = $state(faq.author);
	let question = $state(faq.question);
	let title = $state(faq.title);
	let answer = $state(faq.answer);
	let creationDate = faq.creationDate;

	function submitForm() {
		onsubmitFaq({ id, title });
	}
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
	<div class="w-[90%] max-w-md rounded-xl bg-white p-6 shadow-xl">
		<div>
			<h2 class="mb-2 text-lg font-semibold">Conferma Eliminazione</h2>
			<p class="mb-2 mt-2">Sei sicuro di voler eliminare la FAQ "{title}"?</p>
			<div class="center mt-2 flex flex-row">
				<form onsubmit={submitForm}>
					<input
						type="password"
						id="password"
						name="password"
						placeholder="Inserisci la tua password"
						required
						class="bg-gray rounded-full border-none px-4 py-2"
					/>

					<div class="mt-2 flex flex-row justify-self-center">
						<button
							class="mr-2 rounded-full bg-red-600 p-1 text-white hover:bg-red-600/80"
							type="submit"
							aria-label="Confirm"
							title="Conferma">Conferma</button
						>
						<button
							class="mr-2 rounded-full bg-orange-600 p-1 hover:bg-orange-600/80"
							type="button"
							aria-label="Cancel"
							title="Annulla"
							onclick={oncancel}>Annulla</button
						>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>
