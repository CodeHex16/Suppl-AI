<script lang="ts">
	import ChatNavBar from '$lib/components/ChatNavBar.svelte';
	import SendMessage from '$lib/components/SendMessage.svelte';
	import Messages from '$lib/components/Messages.svelte';
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let { data } = $props();
	let waitingForResponse = $state(false);
	let scrollToDiv: HTMLDivElement;
	let answer = $state('');
	let abortController: AbortController | null = null;

	let messages = $state(data.chat.messages);

	function scrollToBottom() {
		setTimeout(function () {
			scrollToDiv.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
		}, 100);
	}

	async function streamResponse(messageData: string) {
		//TODO: send more than one message
		if (abortController) {
			abortController.abort();
		}

		abortController = new AbortController();
		answer = '';

		try {
			const response = await fetch('/api/stream_chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ messages: messageData }),
				signal: abortController.signal
			});

			if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
			if (response.body === null) throw new Error('ReadableStream not supported');

			const reader = response.body.getReader();
			const decoder = new TextDecoder();

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				const chunk = decoder.decode(value, { stream: true });
				const lines = chunk.split('\n\n');

				for (const line of lines) {
					if (line.startsWith('data: ')) {
						try {
							const data = JSON.parse(line.substring(6));

							if (data.choices && data.choices[0].delta && data.choices[0].delta.content) {
								answer += data.choices[0].delta.content;
								scrollToBottom();
							}
						} catch (err) {
							console.error('Errore parsing SSE:', err);
						}
					}
				}
			}

			// Quando la risposta è completa
			messages = [...messages, { sender: 'bot', content: answer }];

			waitingForResponse = false;
			await fetch(`/api/save_bot_message`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					content: answer,
					chat_id: $page.params.id
				})
			});
			answer = '';
		} catch (err: any) {
			if (err instanceof Error && err.name !== 'AbortError') {
				console.error('Errore stream:', err);
				waitingForResponse = false;
			}
		}
	}

	onMount(() => {
		scrollToBottom();
	});
</script>

<div class="grid-chat mx-auto grid h-dvh max-w-xl py-4">
	<ChatNavBar data={data.chat.name} />
	<div class="flex-grow overflow-y-auto">
		<Messages
			data={waitingForResponse
				? [...messages, { sender: 'bot', content: answer, isLoading: true }]
				: messages}
		/>
		<div bind:this={scrollToDiv}></div>
	</div>
	<form
		method="POST"
		use:enhance={({ formData, formElement }) => {
			waitingForResponse = true;
			let messageInput = formData.get('message')?.toString() || '';

			if (messageInput) {
				messages = [
					...messages,
					{
						sender: 'user',
						content: messageInput
					}
				];
			}
			scrollToBottom();

			streamResponse(messageInput);

			return async () => {
				formElement.reset();
				await invalidate('app:messages');
			};
		}}
	>
		<SendMessage sending={waitingForResponse} />
	</form>
</div>
