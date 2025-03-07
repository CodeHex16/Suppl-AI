<script lang="ts">
	import UserMessage from './UserMessage.svelte';
	import BotMessage from './BotMessage.svelte';
	let { data } = $props();
</script>

<main class="scroll-snap-y-container prose flex-1 overflow-y-auto px-4">
	<div class="flex flex-col space-y-2">
		{#each data as message}
			{#if message.sender === 'bot'}
				{#if message.isLoading}
					<BotMessage content={message.content} />
				{:else}
					<BotMessage content={message.content} />
				{/if}
			{:else}
				<UserMessage content={message.content} />
			{/if}
		{/each}
	</div>
</main>
