<script lang="ts">
	let { onSubmitDocument, onCancel } = $props<{
		onSubmitDocument: (data: { name: string; files: FileList; creationDate: string }) => void;
		onCancel: () => void;
	}>();

	function submitForm() {
		if (fileInput.files && fileInput.files.length > 0) {
			onSubmitDocument({
				files: fileInput.files,
				creationDate: new Date().toISOString()
			});
		} else {
			console.error('Nessun file selezionato');
		}
	}

	let fileInput: HTMLInputElement;
	let files = $state(null);

	$inspect(files);
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
	<div class="w-[90%] max-w-md rounded-xl bg-white p-6 shadow-xl">
		<h2 class="mb-4 text-center text-lg font-semibold">Inserimento File</h2>
		<form onsubmit={submitForm}>
			<div class="mb-4">
				<label for="file">Seleziona uno o più file</label>
				<input
					bind:this={fileInput}
					bind:value={files}
					id="file"
					type="file"
					accept=".txt, .pdf"
					required
					multiple
					class="text-gray file:bg-gray mt-2 block w-full cursor-pointer rounded-lg border border-gray-400 p-4
					text-sm file:mr-4 file:rounded-full file:border-0 file:px-4 file:py-2
					file:text-sm file:font-semibold hover:file:bg-blue-600 focus:border-blue-500
					focus:outline-none focus:ring-2 focus:ring-blue-500 dark:file:bg-[#4a4a4a] dark:file:text-white"
				/>
			</div>

			<div class="flex justify-end space-x-2">
				<button
					class="bg-gray rounded-lg px-4 py-2 transition duration-150 ease-in"
					onclick={onCancel}
				>
					Annulla
				</button>
				<button
					class="item-primary rounded-lg px-4 py-2 transition duration-150 ease-in"
					type="submit"
				>
					Carica
				</button>
			</div>
		</form>
	</div>
</div>
