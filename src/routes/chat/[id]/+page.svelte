<script lang="ts">
	import ChatNavBar from '$lib/components/ChatNavBar.svelte';
	import SendMessage from '$lib/components/SendMessage.svelte';
	import Messages from '$lib/components/Messages.svelte';
	import DeleteChatModal from '$lib/components/DeleteChatModal.svelte';
	import { enhance } from '$app/forms';
	import { invalidate, invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';

	let { data } = $props();

	let waitingForResponse = $state(false);
	let scrollToDiv: HTMLDivElement;
	let answer = $state('');
	let abortController: AbortController | null = null;
	let showModalDelete = $state(false);

	let messages = $state(data.chat.messages);
	let chatName = $state(data.chat.name);

	function scrollToBottom() {
		setTimeout(function () {
			scrollToDiv.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
		}, 100);
	}

	async function streamResponse(messageData: string) {
		if (abortController) {
			abortController.abort();
		}
		
		abortController = new AbortController();
		answer = '';

		try {
			const response = await fetch('/api/stream_chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					question: messageData,
					messages: messages
				}),
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
							const data = line.substring(6);
							if (data !== '[DONE]') {
								answer += data;
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
					chat_id: data.chat_id
				})
			});

			if (data.chat.name === 'Chat senza nome' && messages.length > 2) {
				await updateChatName();
			}
			if (data.chat.name === 'Chat senza nome' && messages.length > 2) {
				await updateChatName();
			}

			answer = '';
		} catch (err: any) {
			if (err instanceof Error && err.name !== 'AbortError') {
				console.error('Errore stream:', err);
				waitingForResponse = false;
			}
		}
	}

	async function updateChatName() {
		const res = await fetch('/api/update_chat_name', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				messages: messages,
				chat_id: data.chat_id
			})
		});

		const data_json = await res.json();
		if (!data_json.error) {
			chatName = data_json.title;
			data.chat.name = data_json.title;
			await invalidateAll();
		} else {
			console.error('Errore aggiornamento nome chat:', data_json.error);
		}
	}

	onMount(() => {
		scrollToBottom();
	});

	function openDeleteModal() {
		showModalDelete = true;
	}
</script>

<div class="grid-chat mx-auto grid h-dvh max-w-xl py-4">
	<!--Delete Chat Modal-->
	{#if showModalDelete}
		<DeleteChatModal
			chatName={chatName}
			chatId={data.chat_id}
			onCancel={() => showModalDelete = false}
		/>
	{/if}

	<ChatNavBar data={data} deleteChat={openDeleteModal} />
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
