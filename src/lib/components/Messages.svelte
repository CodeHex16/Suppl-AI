<script lang="ts">
	import UserMessage from './UserMessage.svelte';
	import BotMessage from './BotMessage.svelte';
	let { data } = $props();
	console.log(data);
</script>

<main class="scroll-snap-y-container prose flex-1 overflow-y-auto p-4">
	<div class="flex flex-col space-y-2">
		{#each data as message}
			{#if message.sender === 'bot'}
				<BotMessage content={message.content} />
			{:else}
				<UserMessage content={message.content} />
			{/if}
		{/each}
	</div>
</main>
