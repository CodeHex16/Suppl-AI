<script lang="ts">
	import { onMount } from 'svelte';
	import { ThumbsUp, ThumbsDown } from 'lucide-svelte';
	let { data } = $props();
	import { marked } from 'marked';
	import { page } from '$app/state';
	import { on } from 'svelte/events';

	// $inspect(data);
	// $inspect(page.params);

	onMount(() => {
		if (data.rating) {
			like = true;
		} else if (data.rating === false) {
			dislike = true;
		} else {
			like = false;
			dislike = false;
		}
	});

	marked.use({
		gfm: true,
		// breaks: true,
		pedantic: false
	});

	function formatMessage(text: string) {
		return marked(text);
	}

	let like = $state(false);
	let dislike = $state(false);

	function rateMessage(chatId: string, messageId: string, rating: boolean | null) {
		console.log('like: ', like, 'dislike: ', dislike);

		if (!(like || dislike)) {
			rating = null;
		}

		console.log('rating: ', rating);

		fetch('/api/rate_message', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				chat_id: chatId,
				message_id: messageId,
				rating: rating
			})
		});
	}

	function toggleThumbsUp() {
		like = !like;
		dislike = false;

		rateMessage(page.params.id, data._id, like);
	}

	function toggleThumbsDown() {
		dislike = !dislike;
		like = false;

		rateMessage(page.params.id, data._id, !dislike);
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
			<div class="font-bold item-primary px-2 rounded-full w-fit">Suppl-AI</div>
			<!-- <div class="font-bold text-primary">Suppl-AI</div> -->
			{#if data.content == ''}
				<div class="mt-4 animate-pulse">
					<div class="mb-2 h-2 w-40 rounded bg-gray"></div>
					<div class="mb-2 h-2 w-5/6 rounded bg-gray"></div>
				</div>
			{:else}
			<!-- prose dark:prose-invert -->
				<div class="markdown-content"> 
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
					id="like-button-{data._id}"
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
					id="dislike-button-{data._id}"
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
