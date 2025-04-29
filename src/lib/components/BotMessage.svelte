<script lang="ts">
	import { ThumbsUp, ThumbsDown } from 'lucide-svelte';
	let { content, timestamp } = $props();
	import { marked } from 'marked';

	function formatMessage(text: string) {
		return marked(text);
	}
	console.log('date: ', timestamp);

	let like = false;
	let dislike = false;

	async function toggleThumbsUp() {
		like = !like;
		dislike = false;
		console.log('like: ', like);
	}

	async function toggleThumbsDown() {
		dislike = !dislike;
		like = false;
		console.log('dislike: ', dislike);
	}
</script>

<div class="flex flex-col items-stretch">
	<div class="flex justify-start">
		<div class="max-w-sm rounded-t-3xl rounded-br-3xl bg-white p-4 text-black">
			<div class="text-primary font-bold">Supply</div>
			{#if content == ''}
				<div class="mt-4 animate-pulse">
					<div class="mb-2 h-2 w-40 rounded bg-slate-200"></div>
					<div class="mb-2 h-2 w-5/6 rounded bg-slate-200"></div>
				</div>
			{:else}
				<div class="markdown-content">
					{@html formatMessage(content)}
				</div>
			{/if}
			<div class="ml-8 mt-1 flex flex-row-reverse">
				<button
					class="ml-2 mr-2 h-10 w-10 bg-gray-100 p-2 hover:bg-gray-200"
					on:click={toggleThumbsUp}
					aria-label="Like"
					title="Mi piace"
				>
					{#if like}
						<div class="item-primary">
							<ThumbsUp />
						</div>
					{:else}
						<div class="bg-gray-100 text-gray-500">
							<ThumbsUp />
						</div>
					{/if}
				</button>
				<button
					class="ml-2 mr-2 h-10 w-10 bg-gray-100 p-2 hover:bg-gray-200"
					on:click={toggleThumbsDown}
					aria-label="Dislike"
					title="Non mi piace"
				>
					{#if dislike}
						<div class="item-primary">
							<ThumbsDown />
						</div>
					{:else}
						<div class="bg-gray-100 text-gray-500">
							<ThumbsDown />
						</div>
					{/if}
				</button>
				<!--
				<input id="thumbUp" type="radio" name="thumbUp" value="1" class="peer hidden" />
				<label
					for="1"
					class="ml-2 mr-2 block h-10 w-10 cursor-pointer select-none rounded-full bg-gray-100 p-2 hover:bg-gray-200 peer-checked:bg-green-700"
				>
					<ThumbsUp /></label
				>
				<input id="thumbDown" type="radio" name="thumbDown" value="2" class="peer hidden" />
				<label
					for="2"
					class="ml-2 mr-2 block h-10 w-10 cursor-pointer select-none rounded-full bg-gray-100 p-2 hover:bg-gray-200 peer-checked:bg-red-700"
					><ThumbsDown /></label
				>-->
			</div>
		</div>
	</div>

	<div class="ml-1 flex items-stretch justify-start text-xs text-gray-500">
		{#if !timestamp}
			<p class="mt-1">Data non definita</p>
		{:else}
			<p class="mt-1">{timestamp}</p>
		{/if}
	</div>
</div>

<style>
	/* Stili opzionali per la formattazione del markdown */
	.markdown-content :global(ul),
	.markdown-content :global(ol) {
		padding-left: 1.5rem;
		margin: 0.5rem 0;
	}
	.markdown-content :global(li) {
		margin: 0.25rem 0;
	}
	.markdown-content :global(p) {
		margin: 0.5rem 0;
	}
	.markdown-content :global(strong) {
		font-weight: bold;
	}
</style>
