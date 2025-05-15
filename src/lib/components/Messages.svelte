<script lang="ts">
	import UserMessage from './UserMessage.svelte';
	import BotMessage from './BotMessage.svelte';
	import { type Message } from '$lib/types';
	
	let {
		data
	}: {
		data: Message[];
	} = $props();
</script>

<main class="scroll-snap-y-container prose flex-1 overflow-y-auto px-4">
	<div class="flex flex-col space-y-2">
		{#each data as message}
			{#if message.sender === 'bot'}
				{#if message.isLoading}
					<BotMessage data={message} />
				{:else}
					<BotMessage data={message} />
				{/if}
			{:else}
				<UserMessage data={message} />
			{/if}
		{/each}
	</div>
</main>
