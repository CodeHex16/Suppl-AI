<script lang="ts">
	import NavBar from './NavBar.svelte';
	import BottomBar from './BottomBar.svelte';
	import Messages from './Messages.svelte';
	import { enhance } from '$app/forms';
	let { data } = $props();
</script>

<div class="grid-chat mx-auto grid h-dvh max-w-xl">
	<NavBar />
	<Messages {data} />
	<form method="POST" use:enhance>
		<BottomBar />
	</form>
</div>
