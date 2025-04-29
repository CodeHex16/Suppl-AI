<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { redirect } from '@sveltejs/kit';
	const dispatch = createEventDispatcher();


	let question = '';
	let abbr = '';
	let author = '';

	function submitForm() {
		dispatch('submitFaq', {
			question,
			abbr,
			author,
			creationDate: new Date().toISOString()
		});
	}
</script>

<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
	<div class="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-xl">
		<h2 class="text-lg font-semibold mb-4">Nuova FAQ</h2>

		<div class="mb-3">
			<input type="text" bind:value={author} placeholder="Autore" required class="w-full pl-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
		</div>
		<div class="mb-3">
			<input type="text" bind:value={abbr} placeholder="Domanda abbreviata" required class="w-full pl-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
		</div>
		<div class="mb-3">
			<input type="text" bind:value={question} placeholder="Domanda completa" required class="w-full pl-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
		</div>

		<div class="flex justify-end space-x-2">
			<button class="px-4 py-2 rounded-lg bg-gray transition duration-150 ease-in" onclick={() => dispatch('cancel')}>Annulla</button>
			<button class="px-4 py-2 rounded-lg item-primary transition duration-150 ease-in" onclick={submitForm}>Salva</button>
		</div>
	</div>
</div>