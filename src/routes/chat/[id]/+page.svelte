<script lang="ts">
	import ChatNavBar from '$lib/components/ChatNavBar.svelte';
	import SendMessage from '$lib/components/SendMessage.svelte';
	import Messages from '$lib/components/Messages.svelte';
	import DeleteChatModal from '$lib/components/DeleteChatModal.svelte';
	import { invalidate, invalidateAll } from '$app/navigation';

	import { onMount, tick } from 'svelte';
	import type { Chat, Faq } from '$lib/types';
	import { logger } from '$lib/utils/logger';
	let {
		data
	}: {
		data: {
			chat: Chat;
			chat_id: string;
			faqs: Faq[];
		};
	} = $props();

	let waitingForResponse = $state(false);
	let scrollToDiv: HTMLDivElement;
	let answer = $state('');
	let abortController: AbortController | null = null;
	let showModalDelete = $state(false);
	let showModalFaq = $state(false);

	let messages = $state(data.chat.messages);

	let chatName = $state(data.chat.name);

	let inputValue = $state('');

	async function scrollToBottom() {
		await tick();
		setTimeout(function () {
			scrollToDiv?.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
		}, 0);
	}

	/**
	 * @description Funzione per lo streaming della risposta
	 * @param {string} messageData - Il messaggio da inviare
	 */
	async function streamResponse(messageData: string) {
		if (abortController) {
			logger.info('Abortando richiesta di streaming in corso...');
			abortController.abort();
		}

		abortController = new AbortController();
		answer = '';

		logger.info('Inizio streaming risposta...');

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

				let chunk = decoder.decode(value, { stream: true });
				chunk = chunk.replace('\n\n\n\n', '[n]\n\n');
				const lines = chunk.split('\n\n');

				for (let line of lines) {
					if (line.startsWith('\n')) {
						answer += '\n';
						line = line.substring(1);
					}
					if (line.startsWith('data: ')) {
						try {
							let data = line.substring(6);
							data = data.replace('[n]', '\n');
							if (data !== '[DONE]') {
								answer += data;
								scrollToBottom();
							}
						} catch (err) {
							logger.error('Errore parsing SSE:', err);
						}
					} else if (line == '[n]' || line == '\n') {
						answer += '\n';
					}
				}
			}
			logger.log('Risposta completa:', answer);

			let request = await fetch(`/api/save_bot_message`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					content: answer,
					chat_id: data.chat_id
				})
			});

			if (!request.ok) {
				logger.error('Errore salvataggio messaggio bot:', request.statusText);
				throw new Error(`HTTP error: ${request.status}`);
			}
			const request_json = await request.json();

			logger.log('Risposta salvata:', request_json);

			const messageRes = request_json.data;

			// Quando la risposta è completa
			messages = [
				...messages,
				{ _id: messageRes._id, sender: messageRes.sender, content: messageRes.content }
			];

			waitingForResponse = false;

			await scrollToBottom();

			if (data.chat.name === 'Chat senza nome' && messages.length > 2) {
				await updateChatName();
			}
		} catch (err: any) {
			if (err instanceof Error && err.name !== 'AbortError') {
				logger.error('Errore stream:', err);
				waitingForResponse = false;
			}
		}
	}

	/**
	 * @description Aggiorna il nome della chat
	 */
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
		logger.log('Risposta aggiornamento nome chat:', data_json);
		if (!data_json.error) {
			logger.log('Nome chat aggiornato:', data_json.title);
			chatName = data_json.title;
			data.chat.name = data_json.title;
			await invalidateAll();
		} else {
			logger.error('Errore aggiornamento nome chat:', data_json.error);
		}
	}



	/**
	 * @description Gestisce l'invio del messaggio
	 * @param {Event} event - L'evento di invio del modulo
	 */
	async function submitMessageHandler(event: Event) {
		event.preventDefault();
		waitingForResponse = true;
		const form = event.target as HTMLFormElement;
		const messageInput = form.elements.namedItem('message') as HTMLInputElement;
		const messageValue = messageInput.value || '';

		logger.info('Invio messaggio:', messageValue);

		if (messageValue) {
			messages = [
				...messages,
				{
					sender: 'user',
					content: messageValue
				}
			];
			messageInput.value = '';
			inputValue = '';
			scrollToBottom();

			logger.info('Salvataggio messaggio utente...');
			let request_save = await fetch('/chat/'+data.chat_id,{
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: new URLSearchParams({
					message: messageValue
				})
			});
			if (!request_save.ok) {
				logger.error('Errore salvataggio messaggio:', request_save.statusText);
				throw new Error(`HTTP error: ${request_save.status}`);
			}
			logger.log('Messaggio utente salvato:', messageValue);

			await streamResponse(messageValue);
			// reset form
			//form.reset();
			await invalidate('app:messages');
		}
	}

	onMount(async () => {
		await scrollToBottom();
	});
	scrollToBottom();
	

	function sendFaq(faq: any) {
		inputValue = faq.question;
		showModalFaq = false;
	}
</script>

<div class="grid-chat mx-auto grid h-dvh max-w-xl py-4">
	{#if showModalFaq}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div class="w-[90%] max-w-md rounded-xl bg-white p-6 shadow-xl">
				<div class="flex flex-col items-center justify-center">
					<h2 class="mb-2 text-lg font-semibold">Scegli una FAQ</h2>
					<p class="my-2 text-center">Seleziona una delle FAQ per inviarla come messaggio.</p>
					<div class="max-h-56 overflow-auto">
						{#each data.faqs as faq}
							<button
								onclick={() => sendFaq(faq)}
								class="bg-gray mb-2 w-full rounded-full px-4 py-2 text-left font-semibold transition ease-in"
								>{faq.title}</button
							>
						{/each}
					</div>

					<div class="mt-2 flex flex-row gap-4 justify-self-center">
						<button
							class="bg-gray rounded-full px-4 py-2 transition ease-in"
							type="button"
							aria-label="Cancel"
							title="Annulla"
							onclick={() => (showModalFaq = false)}>Annulla</button
						>
					</div>
				</div>
			</div>
		</div>
	{/if}
	<!--Delete Chat Modal-->
	{#if showModalDelete}
		<DeleteChatModal {chatName} chatId={data.chat_id} onCancel={() => (showModalDelete = false)} />
	{/if}

	<ChatNavBar {data} deleteChat={()=>(showModalDelete = true)} />
	<div class="flex-grow overflow-y-auto">
		<Messages
			data={waitingForResponse
				? [...messages, { sender: 'bot', content: answer, isLoading: true }]
				: messages}
		/>
		<div bind:this={scrollToDiv}></div>
	</div>

	<form data-testid="input_form" method="POST" onsubmit={submitMessageHandler}>
		<SendMessage sending={waitingForResponse} onClickFaq={()=>(showModalFaq = true)} bind:inputValue={inputValue}  />
	</form>
</div>
