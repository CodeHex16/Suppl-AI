<script lang="ts">
	type Document = { id: string; author: string; name: string; creationDate: string };

	let { document, onSubmitDocument, onCancel } = $props<{
		document: Document;
		onSubmitDocument: (data: Document) => void;
		onCancel: () => void;
	}>();

	let id = $state(document.id);
	let name = $state(document.name);

	function submitForm() {
		onSubmitDocument(document);
	}
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
	<div class="w-[90%] max-w-md rounded-xl bg-white p-6 shadow-xl">
		<div>
			<h2 class="mb-2 text-lg font-semibold">Conferma Eliminazione</h2>
			<p class="mb-2 mt-2">Sei sicuro di voler eliminare il documento "{name}"?</p>
			<div class="center mt-2 flex flex-row">
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
						onclick={submitForm}
					>
						Conferma
					</button>
					<button
						class="mr-2 rounded-full bg-orange-600 p-1 hover:bg-orange-600/80"
						type="button"
						aria-label="Cancel"
						title="Annulla"
						onclick={onCancel}
					>
						Annulla
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
