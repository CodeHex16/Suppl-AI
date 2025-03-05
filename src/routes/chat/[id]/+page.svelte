<script lang="ts">
	import ChatNavBar from '$lib/components/ChatNavBar.svelte';
	import SendMessage from '$lib/components/SendMessage.svelte';
	import Messages from '$lib/components/Messages.svelte';
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';

	let { data } = $props();
	let sending = $state(false);
	let messageInput = '';
</script>

<div class="grid-chat mx-auto grid h-dvh max-w-xl py-4">
	<ChatNavBar data={data.chat.name} />
	<Messages data={data.chat.messages} />
	<form
		method="POST"
		use:enhance={({ formData, formElement }) => {
			sending = true;
			messageInput = formData.get('message')?.toString() || '';

			// Add the message to the UI immediately for better UX
			if (messageInput) {
				data.chat.messages = [
					...data.chat.messages,
					{
						sender: 'user',
						content: messageInput
					}
				];
			}

			return async ({ result }) => {
				// Reset form
				formElement.reset();
				sending = false;

				// Invalidate data to refresh messages
				await invalidate('app:messages');
			};
		}}
	>
		<SendMessage />
	</form>
</div>
