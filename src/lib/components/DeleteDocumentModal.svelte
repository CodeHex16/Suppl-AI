<script lang="ts">
	import { type Document } from '$lib/types';
	let { document, onConfirmDelete, onCancel, errorMessage } = $props();
	import { enhance } from '$app/forms';
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
	<div class="w-[90%] max-w-md rounded-xl bg-white p-6 shadow-xl">
		<div class="flex flex-col items-center justify-center">
			<h2 class="text-lg font-semibold">Conferma Eliminazione</h2>
			{#if errorMessage}
				<p class="mt-2 text-red-500">{errorMessage}</p>
			{/if}
			<p class="my-2 text-center">Sei sicuro di voler eliminare il documento "{document.title}"?</p>

			<form
				method="POST"
				action="/api/users"
				use:enhance={({ formData, cancel }) => {
					onConfirmDelete(formData);
					cancel();
				}}
			>
				<input type="hidden" name="id" value={document._id} />
				<input type="hidden" name="title" value={document.title} />
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
