<script lang="ts">
	import { ThumbsUp, ThumbsDown } from 'lucide-svelte';
	let { data } = $props();
	import { marked } from 'marked';

	function formatMessage(text: string) {
		return marked(text);
	}


	let timestamp = new Date()
	let like = false;
	let dislike = false;
	
	function toggleThumbsUp() {
		like = !like;
		dislike = false;
		console.log('like: ', like);
	}

	function toggleThumbsDown() {
		dislike = !dislike;
		like = false;
		console.log('dislike: ', dislike);
	}
</script>

<div class="flex flex-col items-stretch">
	<div class="flex justify-start">
		<div class="max-w-sm rounded-t-3xl rounded-br-3xl bg-white p-4 text-black">
			<div class="text-primary font-bold">Supply</div>
			{#if data.content == ''}
				<div class="mt-4 animate-pulse">
					<div class="mb-2 h-2 w-40 rounded bg-slate-200"></div>
					<div class="mb-2 h-2 w-5/6 rounded bg-slate-200"></div>
				</div>
			{:else}
				<div class="markdown-content">
					{@html formatMessage(data.content)}
				</div>
			{/if}
			<div class="ml-8 mt-1 flex flex-row-reverse">
				{#if like}
					<button
						class="item-primary hover:bg-primary-200 ml-2 mr-2 h-10 w-10 rounded-full p-2"
						onclick={toggleThumbsUp}
						aria-label="Like"
						title="Risposta utile"
					>
						<ThumbsUp class="item-primary" />
					</button>
				{:else}
					<button
						class="ml-2 mr-2 h-10 w-10 rounded-full p-2 hover:bg-gray-200"
						onclick={toggleThumbsUp}
						aria-label="Like"
						title="Risposta utile"
					>
						<ThumbsUp class="bg-inherit text-gray-500" />
					</button>
				{/if}
				{#if dislike}
					<button
						class="item-primary hover:bg-primary-200 ml-2 mr-2 h-10 w-10 rounded-full p-2"
						onclick={toggleThumbsDown}
						aria-label="Dislike"
						title="Risposta non utile"
					>
						<ThumbsDown class="item-primary" />
					</button>
				{:else}
					<button
						class="ml-2 mr-2 h-10 w-10 rounded-full p-2 hover:bg-gray-200"
						onclick={toggleThumbsDown}
						aria-label="Dislike"
						title="Risposta non utile"
					>
						<ThumbsDown class="bg-inherit text-gray-500" />
					</button>
				{/if}
			</div>
		</div>
	</div>

	<div class="ml-1 flex items-stretch justify-start text-xs text-gray-500">
		{#if !timestamp}
			<p class="mt-1">Adesso</p>
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
