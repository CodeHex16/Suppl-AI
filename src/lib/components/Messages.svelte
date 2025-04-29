<script lang="ts">
    import UserMessage from './UserMessage.svelte';
    import BotMessage from './BotMessage.svelte';
    let { messages, streamingAnswer, isStreaming } = $props();
</script>

<main class="scroll-snap-y-container prose flex-1 overflow-y-auto px-4">
    <div class="flex flex-col space-y-2">
        {#each messages as message } 
            {#if message.sender === 'bot'}
                <BotMessage content={message.content} />
            {:else}
                <UserMessage content={message.content} />
            {/if}
        {/each}

        {#if isStreaming}
            <BotMessage content={streamingAnswer} /> 
        {/if}
    </div>
</main>