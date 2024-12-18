<script lang="ts">
	import UserMessage from './UserMessage.svelte';
	import BotMessage from './BotMessage.svelte';
	let { data } = $props();
</script>

<main class="scroll-snap-y-container flex-1 overflow-y-auto p-4 prose">
	<div class="flex flex-col space-y-2">
		{#each data.messages as message}
			{#if message.authorId === 'user'}
				<UserMessage content={message.content} />
			{:else}
				<BotMessage content={message.content} />
			{/if}
		{/each}
	</div>
</main>
