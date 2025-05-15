<!-- svelte-ignore a11y_autofocus -->
<script>
	import { SendHorizontal, MessageCircleQuestion } from 'lucide-svelte';
	import FaqItem from './FaqItem.svelte';
	import { fly } from 'svelte/transition';
	let { sending, onClickFaq, inputValue = $bindable()} = $props();
</script>

<div class="grid-chat-bottom-bar grid mx-4 mt-4">
	{#if inputValue === ''}
		<button
			type="button"
			onclick={onClickFaq}
			class="h-15 w-15 mr-2 rounded-full bg-white p-4 shadow-md"
		>
			<MessageCircleQuestion />
		</button>
	{/if}

	<input
		transition:fly={{ duration: 200, opacity: 0 }}
		type="text"
		name="message"
		autofocus={true}
		bind:value={inputValue}
		autocomplete="off"
		tabindex={0}
		placeholder="Scrivi un messaggio"
		class="rounded-full border-none border-transparent bg-white p-4 shadow-md focus:border-transparent focus:ring-0 {inputValue !==
		''
			? 'col-span-2'
			: 'col-span-1'}"
	/>

	<button
		type="submit"
		disabled={sending || inputValue === ''}
		class="h-15 w-15 ml-2 rounded-full bg-white p-4 shadow-md"><SendHorizontal /></button
	>
</div>

<style>
	.grid-chat-bottom-bar {
		grid-template-columns: auto minmax(0, 1fr) auto;
	}
</style>
