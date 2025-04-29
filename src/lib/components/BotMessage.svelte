<script lang="ts">
	import { ThumbsUp, ThumbsDown } from 'lucide-svelte';
	let { content } = $props();
	let time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	let date = new Date().toLocaleDateString([], {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	});
	import { marked } from 'marked';

	function formatMessage(text: string) {
		return marked(text);
	}
	console.log('content', content);
	console.log('date', date);
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
				<div class="p-2">
					<ThumbsUp />
				</div>
				<div class="p-2">
					<ThumbsDown />
				</div>
			</div>
		</div>
	</div>
	<div class="ml-1 flex items-stretch justify-start text-xs text-gray-500">
		<p class="mt-1">{date} - {time}</p>
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
