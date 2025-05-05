<script lang="ts">
	import { ThumbsUp, ThumbsDown } from 'lucide-svelte';
	let { data } = $props();
	import { marked } from 'marked';

	marked.use({
		gfm: true,
		breaks: true,
		pedantic: false
	});

	function formatMessage(text: string) {
		return marked(text);
	}

	let like = $state(false);
	let dislike = $state(false);

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

	function formatData(stringDate: string) {
		const date = new Date(stringDate);
		return date.toLocaleString('it-IT', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			timeZone: 'Europe/Rome'
		});
	}
</script>

<div class="flex flex-col justify-start">
	<div class="max-w-sm">
		<div class="rounded-t-3xl rounded-br-3xl bg-white p-4 text-black shadow-md">
			<!-- TODO: Scegliere che versione usare -->
			<!-- <div class="font-bold item-primary px-2 rounded-full w-fit">Suppl-AI</div> -->
			<div class="text-primary font-bold">Suppl-AI</div>
			{#if data.content == ''}
				<div class="mt-4 animate-pulse">
					<div class="mb-2 h-2 w-40 rounded bg-slate-200"></div>
					<div class="mb-2 h-2 w-5/6 rounded bg-slate-200"></div>
				</div>
			{:else}
				<div class="prose dark:prose-invert markdown-content  ">
					<!-- {data.content} -->
					{@html formatMessage(data.content)}
				</div>
			{/if}
		</div>
		<div class="flex flex-row items-center justify-between">
			<div class="text-gray my-auto ml-2 text-sm opacity-80">
				{#if data.timestamp}
					<p class=" my-2">{formatData(data.timestamp)}</p>
				{:else}
					<p class=" my-2">Adesso</p>
				{/if}
			</div>
			<div class="mr-2 flex flex-row-reverse">
				<button
					class="{like
						? 'item-primary'
						: 'text-gray opacity-60'}  flex items-center justify-center rounded-full p-2"
					onclick={toggleThumbsUp}
					aria-label="Like"
					title="Risposta utile"
				>
					<ThumbsUp class="h-4 w-4" />
				</button>

				<button
					class="{dislike
						? 'item-primary'
						: 'text-gray opacity-60'}  flex items-center justify-center rounded-full p-2"
					onclick={toggleThumbsDown}
					aria-label="Dislike"
					title="Risposta non utile"
				>
					<ThumbsDown class="h-4 w-4" />
				</button>
			</div>
		</div>
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
