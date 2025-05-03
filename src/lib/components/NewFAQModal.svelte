<script lang="ts">
	let { onsubmitFaq, oncancel } = $props<{
		onsubmitFaq: (faq: {
			question: string;
			title: string;
			author: string;
			answer: string;
			creationDate: string;
		}) => void;
		oncancel: () => void;
	}>();

	import { User, HelpCircle, MessageSquareText, Tag } from 'lucide-svelte';

	let question = $state('');
	let title = $state('');
	let author = $state('');
	let answer = $state('');

	function submitForm() {
		onsubmitFaq({
			question,
			title,
			author,
			answer,
			creationDate: new Date().toISOString()
		});
	}
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
	<div class="w-[90%] max-w-md rounded-xl bg-white p-6 shadow-xl">
		<h2 class="mb-4 text-center text-lg font-semibold">Nuova FAQ</h2>
		<div class="relative mb-3">
			<Tag class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
			<input
				type="text"
				bind:value={title}
				placeholder="Titolo FAQ"
				name="title"
				required
				class="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
		</div>

		<div class="relative mb-3">
			<HelpCircle class="absolute left-3 top-3 h-5 w-5 text-gray-400" />
			<textarea
				bind:value={question}
				placeholder="Domanda completa"
				required
				rows="3"
				class="w-full resize-none rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
			></textarea>
		</div>
		<div class="relative mb-3">
			<MessageSquareText class="absolute left-3 top-3 h-5 w-5 text-gray-400" />
			<textarea
				bind:value={answer}
				placeholder="Risposta"
				required
				rows="5"
				class="w-full resize-none rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
			></textarea>
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
