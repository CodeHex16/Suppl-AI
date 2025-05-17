// ChatPage.test.ts
import { describe, it, expect, vi, type Mock } from 'vitest';
import ChatPage from '../../../src/routes/chat/[id]/+page.svelte';
import { render, fireEvent, getByTestId } from '@testing-library/svelte';
import type { Chat, Message } from '$lib/types';


globalThis.fetch = vi.fn(() =>
	new Promise((resolve) => {
		resolve({
			ok: true,
			json: () => Promise.resolve({ detail: 'ok' })
		});
	}
)) as unknown as Mock;

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
		let times = 2;
		(globalThis.fetch).mockResolvedValue({
			ok: true,
			body: {
				getReader: () => ({
					read: async () => {
						if(times-- > 0)  return {
						done: false,
						value: new TextEncoder().encode('{"content": "Hello", "role": "assistant"}')
					}
					else
						return {
							done: true,
							value: new TextEncoder().encode('[DONE]')
						}
					}
				})
			},
			json: async () => ({
				data:{
					_id: 'test123',
					sender: 'assistant',
					content: 'Hello',
					messageRes:'Hello',
				},
				chat_id: 'test123',
				messages: [
					{
						content: 'Hello',
						role: 'assistant'
					}
				]
			})
		});
		
		const form = getByTestId('input_form') as HTMLFormElement;
    const messageInput = form.elements.namedItem('message') as HTMLInputElement;
    messageInput.value = 'value';
    await fireEvent.submit(form);
    expect(messageInput.value).toBe(''); 
	});
});
