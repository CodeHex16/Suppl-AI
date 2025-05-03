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
		onsubmitFaq({
			id,
			author,
			question,
			title,
			answer,
			creationDate
		});
	}
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
	<div class="w-[90%] max-w-md rounded-xl bg-white p-6 shadow-xl">
		<h2 class="mb-4 text-lg font-semibold">Modifica FAQ</h2>
		<div class="mb-3">
			<input
				type="text"
				bind:value={author}
				placeholder="Autore"
				required
				class="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
		</div>
		<div class="mb-3">
			<input
				type="text"
				bind:value={title}
				placeholder="Domanda abbreviata"
				required
				class="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
		</div>
		<div class="mb-3">
			<input
				type="text"
				bind:value={question}
				placeholder="Domanda completa"
				required
				class="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
		</div>
		<div class="mb-3">
			<input
				type="text"
				bind:value={answer}
				placeholder="Risposta"
				required
				class="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
		</div>

		<div class="flex justify-end space-x-2">
			<button
				class="bg-gray rounded-lg px-4 py-2 transition duration-150 ease-in"
				onclick={oncancel}>Annulla</button
			>
			<button
				class="item-primary rounded-lg px-4 py-2 transition duration-150 ease-in"
				onclick={submitForm}>Salva</button
			>
		</div>
	</div>
</div>
