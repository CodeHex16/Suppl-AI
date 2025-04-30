<script>
	import { ArrowLeft, Ellipsis, Trash2 } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	const dispatch = createEventDispatcher();
	let { data } = $props();
</script>

<nav class="grid-chat-nav m-4 grid">
	<a href="/">
		<div class="bg-gray h-12 w-12 justify-self-start rounded-full p-3 shadow-md transition">
			<ArrowLeft />
		</div>
	</a>
	<div class="flex flex-row justify-self-center">
		<div class="bg-gray h-12 w-fit justify-self-center rounded-full p-3 px-6">
			<h1 class="">{data}</h1>
		</div>
		<button
			class="text-gray mx-2 h-12 w-12 rounded-full bg-gray-100 p-1 hover:bg-red-700 hover:text-white"
			on:click={()=>dispatch('deleteChat', data)}
			aria-label="Delete chat"
			title="Elimina chat"><Trash2 class="justify-self-center bg-inherit text-inherit" /></button
		>
	</div>
	<ThemeToggle />
</nav>
