// ChatPage.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ChatPage from '../../../src/routes/chat/[id]/+page.svelte';
import { render, fireEvent, getByTestId } from '@testing-library/svelte';
import type { Chat, Message } from '$lib/types';


describe('ChatPage', () => {
	it('adds a message and calls streamResponse on submit', async () => {
		const {getByTestId } = render(ChatPage, {
			props: {
				data: {
					chat: {
						messages: [],
						name: 'Chat senza nome'
					},
					chat_id: 'test123'
				}
			}
		});

		
		const form = getByTestId('input_form') as HTMLFormElement;
    const messageInput = form.elements.namedItem('message') as HTMLInputElement;
    messageInput.value = 'value';
    await fireEvent.submit(form);
    expect(messageInput.value).toBe(''); 
	});
});
