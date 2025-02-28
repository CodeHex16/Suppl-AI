<script lang="ts">
	import ChatNavBar from '$lib/components/ChatNavBar.svelte';
	import SendMessage from '$lib/components/SendMessage.svelte';
	import Messages from '$lib/components/Messages.svelte';
	import { enhance } from '$app/forms';
	let { data } = $props();
</script>

<div class="grid-chat mx-auto grid h-dvh max-w-xl py-4">
	<ChatNavBar data={data.chat.name} />
	<Messages data={data.chat.messages} />
	<form method="POST" use:enhance>
		<SendMessage />
	</form>
</div>
