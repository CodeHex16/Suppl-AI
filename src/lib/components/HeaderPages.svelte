<script lang="ts">
	import { ArrowLeft } from 'lucide-svelte';
	import ThemeToggle from './ThemeToggle.svelte';

	let {
		data,
		title = null
	}: {
		data: {
			theme: string;
		};
		title?: string | null;
	} = $props();
</script>

<header class="mx-4">
	<nav class="grid-chat-nav my-4 grid">
		<a href="/">
			<div class="h-12 w-12 justify-self-start rounded-full bg-white p-3 shadow-md transition">
				<ArrowLeft />
			</div>
		</a>
		{#if title}
			<div
				class="flex h-12 w-fit items-center justify-center justify-self-center rounded-full bg-white p-3 px-6 shadow-md transition"
			>
				<h1 class="text-center text-lg font-semibold">{title}</h1>
			</div>
			{/if}

		<ThemeToggle {data} />
	</nav>
</header>
