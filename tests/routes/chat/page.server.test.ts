// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { load, actions } from '../../../src/routes/chat/[id]/+page.server';
import { redirect, fail } from '@sveltejs/kit';

// Provide a mock fetch
const MockFetch = vi.fn()
global.fetch = MockFetch as Mock;

beforeEach(() => {
	vi.clearAllMocks();
});

const fakeParams = { id: 'chat123' };

beforeEach(() => {
  vi.clearAllMocks();
});

describe('load()', () => {
	it('redirects to /login if no token', async () => {
		await load({
			cookies: {get: () => ''},
			params: fakeParams
		});
		expect(redirect).toHaveBeenCalledWith(303, '/login');
	});

	it('redirects to /login if token is expired', async () => {
		const cookies = {get:() =>'expired_token', delete: vi.fn()};  
		(MockFetch).mockResolvedValueOnce({
			json: () => ({ detail: 'Token is invalid or expired' })
		});
		await load({ cookies, params: fakeParams });
		expect(redirect).toHaveBeenCalledWith(303, '/login');
	});

	it('redirects to / if chat not found', async () => {
		(MockFetch).mockResolvedValueOnce({
			json: () => ({ detail: 'Chat not found' })
		});
		await load({ cookies: {get:()=>'not_found'}, params: fakeParams });
		expect(redirect).toHaveBeenCalledWith(303, '/');
	});

	it('fails if updateChatNameIfNeeded fails', async () => {
		const chat = {
			name: 'Chat senza nome',
			messages: [{ content: 'a' }, { content: 'b' }, { content: 'c' }]
		};

		MockFetch
			.mockResolvedValueOnce({ json: () => chat }) // get chat
			.mockResolvedValueOnce({ ok: false, status: 500 });       // LLM returns error

		await load({ cookies: {get:()=>"has"}, params: fakeParams });
		expect(fail).toHaveBeenCalledWith(500, { error: 'Failed to generate chat name' });
	});

	it('returns chat and chat_id if successful', async () => {
		const chat = {
			name: 'Chat senza nome',
			messages: [{ content: 'hello' }, { content: 'world' }, { content: 'again' }]
		};

		(MockFetch)
			.mockResolvedValueOnce({ json: () => chat }) // fetch chat
			.mockResolvedValueOnce({ ok: true, json: () => 'New title' }) // /chat_name
			.mockResolvedValueOnce({ ok: true }); // patch name

		const result = await load({ cookies: { get:() =>'ok'}, params: fakeParams });
		expect(result?.chat).toBeDefined();
		expect(result?.chat_id).toBe('chat123');
	});
});

describe('actions.default', () => {
	it('does nothing if no message', async () => {
		const fakeForm = new FormData();
		const result = await actions.default({
			request: { formData: () => fakeForm },
			params: fakeParams,
			cookies: {get:()=>'ok'}
		});
		expect(result).toBeUndefined();
	});

	it('succeeds if message sent correctly', async () => {
		const form = new FormData();
		form.set('message', 'Hello');

		(MockFetch).mockResolvedValueOnce({ ok: true });

		const result = await actions.default({
			request: { formData: () => form },
			params: fakeParams,
			cookies: {get:()=>'ok'}
		});

		expect(result).toEqual({ success: true });
	});

	it('fails if response is not ok', async () => {
		const form = new FormData();
		form.set('message', 'Hello');

		(MockFetch).mockResolvedValueOnce({ ok: false,status: 500 });

		await actions.default({
			request: { formData: () => form },
			params: fakeParams,
			cookies: {get:()=>'ok'}
		});

		expect(fail).toHaveBeenCalledWith(500, { error: 'Failed to send message' });
	});

	it('fails if fetch throws error', async () => {
		const form = new FormData();
		form.set('message', 'Hello');

		MockFetch.mockRejectedValueOnce(new Error('Network error'));

		await actions.default({
			request: { formData: () => form },
			params: fakeParams,
			cookies: {get:()=>'ok'}
		});

		expect(fail).toHaveBeenCalledWith(500, { error: 'Failed to send message' });
	});
});
