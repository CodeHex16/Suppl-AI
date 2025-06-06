<script lang="ts">
	import { logger } from '$lib/utils/logger';

	let {
		onSubmitDocument,
		onCancel
	}: {
		onSubmitDocument: () => Promise<void>;
		onCancel: () => void;
	} = $props();

	let isLoading = $state(false);
	let errorMessage = $state<string | null>(null); // Stato per messaggi di errore

	async function handleFormSubmit(event: Event) {
		event.preventDefault();
		isLoading = true;
		errorMessage = null;
		const formData = new FormData(event.target as HTMLFormElement);
		const files = formData.getAll('files') as File[];
		if (files.length === 0) {
			errorMessage = 'Seleziona almeno un file.';
			isLoading = false; // Imposta isLoading a false in caso di errore
			return;
		}
		logger.info('Files selected:', files);

		// Invia i dati del modulo al server
		const response = await fetch('/api/documents', {
			method: 'POST',
			body: formData,
		});

		
		if (response.ok) {
			logger.info('Files uploaded successfully');
			await onSubmitDocument();
			onCancel();
		} else {
			// Gestisci l'errore del server
			errorMessage = 'Si è verificato un errore durante il caricamento del file.';
			// Gestisci l'errore di rete
			logger.error('Network error:', response.statusText);
		}
		isLoading = false; // Imposta isLoading a false dopo la risposta
	}
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
	<div class="w-[90%] max-w-md rounded-xl bg-white p-6 shadow-xl">
		<h2 class="mb-4 text-center text-lg font-semibold">Inserimento File</h2>
		{#if errorMessage}
			<p class="mb-4 text-center text-red-500">{errorMessage}</p>
		{/if}
		{#if isLoading}
			<div class="flex flex-col items-center text-center">
				<p class="mb-4">Caricamento in corso...</p>
				<div role="status" class="m-auto">
					<svg
						aria-hidden="true"
						class="h-10 w-10 animate-spin fill-blue-500 text-gray-200 dark:text-gray-600"
						viewBox="0 0 100 101"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
							fill="currentColor"
						/>
						<path
							d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
							fill="currentFill"
						/>
					</svg>
					<span class="sr-only">Caricamento...</span>
				</div>
			</div>
		{:else}
			<form data-testid="upload-form" onsubmit={handleFormSubmit}>
				<div class="mb-4">
					<label for="files">Seleziona uno o più file</label>
					<input
						data-testid="file-input"
						id="files"
						name="files"
						type="file"
						accept=".txt, .pdf"
						required
						multiple
						class="text-gray file:bg-gray mt-2 block w-full cursor-pointer rounded-lg border border-gray-400 p-4
					text-sm file:mr-4 file:rounded-full file:border-0 file:px-4 file:py-2
					file:text-sm file:font-semibold focus:border-blue-500
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
		{/if}
	</div>
</div>
