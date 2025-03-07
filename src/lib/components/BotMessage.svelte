<script lang="ts">
	let { content } = $props();
	import { marked } from 'marked';

	function formatMessage(text: string) {
		return marked(text);
	}
</script>

<div class="flex justify-start">
	<div class="max-w-sm rounded-t-3xl rounded-br-3xl bg-white p-4 text-black">
		<div class="font-bold text-blue-500">Supply</div>
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
	</div>
</div>

<style>
    /* Stili opzionali per la formattazione del markdown */
    .markdown-content :global(ul), .markdown-content :global(ol) {
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