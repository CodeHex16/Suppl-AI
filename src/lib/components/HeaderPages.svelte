<script lang="ts">
	import { ArrowLeft } from 'lucide-svelte';
	import ThemeToggle from './ThemeToggle.svelte';

	let {data, title} = $props();
</script>

<header class="mt-4">
	<nav class="grid-chat-nav grid  my-4">
		<a href="/">
			<div class="h-12 w-12 justify-self-start rounded-full bg-gray shadow-md p-3 transition">
				<ArrowLeft />
			</div>
		</a>
		<div class="h-12 w-fit justify-self-center rounded-full bg-gray p-3 px-6 transition">
			<h1 class="text-center text-lg font-semibold">{title}</h1>
		</div>
		<ThemeToggle {data}/>
	</nav>
</header>