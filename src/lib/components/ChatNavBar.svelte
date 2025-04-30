<script>
	import { ArrowLeft, Ellipsis } from 'lucide-svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';

	let { data } = $props();
</script>

<nav class="grid-chat-nav mx-4 mb-4 grid overflow-hidden">
	<a href="/">
		<div class="h-12 w-12 justify-self-start rounded-full bg-gray shadow-md p-3 transition">
			<ArrowLeft />
		</div>
	</a>
	<div class="h-12 min-w-0 max-w-[calc(100%-3em)] justify-self-center rounded-full bg-gray p-3 px-6 transition">
        <h1 class="overflow-hidden text-ellipsis whitespace-nowrap">{data.chat.name}</h1>
	</div>
	<ThemeToggle {data} />
</nav>
