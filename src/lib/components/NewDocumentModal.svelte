<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	let name = '';
	let author = '';

	function submitForm() {
		dispatch('submitDocument', {
			name,
			author,
			creationDate: new Date().toISOString()
		});
	}

	let files: any, fileInput;
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
	<div class="w-[90%] max-w-md rounded-xl bg-white p-6 shadow-xl">
		<h2 class="mb-4 text-lg font-semibold">Inserimento File</h2>

		<div class="mb-3">
			<input
			id="name"	
			type="text"
				bind:value={name}
				placeholder="Nome del documento"
				required
				class="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
		</div>
		<div class="mb-3">
			<label for="file">Seleziona uno o più file</label>
			<input
				bind:value={files}
				bind:this={fileInput}
				id="file"
				type="file"
				accept=".txt, .pdf"
				required
				multiple
				class="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
			{#if files && files[0]}
				<p>
					{files[0].name}
				</p>
			{/if}
		</div>

		<div class="flex justify-end space-x-2">
			<button
				class="bg-gray rounded-lg px-4 py-2 transition duration-150 ease-in"
				onclick={() => dispatch('cancel')}>Annulla</button
			>
			<button
				class="item-primary rounded-lg px-4 py-2 transition duration-150 ease-in"
				onclick={submitForm}>Salva</button
			>
		</div>
	</div>
</div>
