<script>
	import { ArrowLeft, Ellipsis } from 'lucide-svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';

	let { data } = $props();
</script>

<nav class="grid-chat-nav m-4 grid">
	<a href="/">
		<div class="h-12 w-12 justify-self-start rounded-full bg-gray shadow-md p-3 transition">
			<ArrowLeft />
		</div>
	</a>
	<div class="h-12 w-fit justify-self-center rounded-full bg-gray p-3 px-6">
		<h1 class="">{data}</h1>
	</div>
	<ThemeToggle />
</nav>
