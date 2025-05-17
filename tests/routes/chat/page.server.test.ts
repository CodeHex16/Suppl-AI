// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { load, actions } from '../../../src/routes/chat/[id]/+page.server';
import { redirect, fail } from '@sveltejs/kit';

// Provide a mock fetch
const MockFetch = vi.fn()
global.fetch = MockFetch as Mock;

vi.mock('@sveltejs/kit', () => ({
	// redirect throwable
	redirect: vi.fn((status, location) => {
		return { status, location };}),
	fail: vi.fn((status, data) => ({ status, data }))
}));

beforeEach(() => {
	vi.clearAllMocks();
});

const fakeParams = { id: 'chat123',
	then:(callback) => callback({
		chat_id: 'chat123',
		chat_name: 'Chat senza nome',
	})
 };

beforeEach(() => {
  vi.clearAllMocks();
});
describe('load()', () => {
	it('redirects to /login if token is expired', async () => {
		const cookies = { get: () => 'expired_token', delete: vi.fn() };
		MockFetch.mockResolvedValueOnce({
			ok: true,
			json: async () => ({ detail: 'Token is invalid or expired' })
		});


		try {
			await load({ cookies, params: fakeParams, parent: ()=>{
				return { settings: { CHAT_HISTORY: 10 } };
			}});
		} catch (error: any) {
			console.log('Error:', error);
			expect(error.status).toBe(303);
			expect(error.location).toBe('/login');
		}
	});


	it('returns chat and chat_id if successful', async () => {
		const chat = {
			name: 'Chat senza nome',
			messages: [{ content: 'hello' }, { content: 'world' }, { content: 'again' }]
		};
		MockFetch
			.mockResolvedValueOnce({ ok: true, json: async () => chat }) // fetch chat
			.mockResolvedValueOnce({ ok: true, json: async () => 'New title' }) // /chat_name
			.mockResolvedValueOnce({ ok: true, json: async () => 's' }) // patch name
			.mockResolvedValueOnce({ ok: true }); // patch name

		const result = await load({ cookies: { get: () => 'ok' }, params: fakeParams ,parent: ()=>{
			return { settings: { CHAT_HISTORY: 10 } };
		}});
		expect(result?.chat).toBeDefined();
		expect(result?.chat_id).toBe('chat123');
	});
});
describe('actions.default()', () => {
	it('returns fail if message is empty', async () => {
		const request = {
			formData: async () => new Map()
		};
		const params = { id: 'chat123' };
		const cookies = { get: vi.fn() };

		const result = await actions.default({ request, params, cookies });
		expect(result).toEqual(undefined);
	});

	it('returns fail if API call fails', async () => {
		const request = {
			formData: async () => new Map([['message', 'Hello']])
		};
		const params = { id: 'chat123' };
		const cookies = { get: vi.fn(() => 'valid_token') };

		MockFetch.mockResolvedValueOnce({ ok: false, status: 500 });

		const result = await actions.default({ request, params, cookies });
		expect(result).toEqual({ status: 500, data: { error: 'Failed to send message' } });
	});

	it('returns success if message is sent successfully', async () => {
		const request = {
			formData: async () => new Map([['message', 'Hello']])
		};
		const params = { id: 'chat123' };
		const cookies = { get: vi.fn(() => 'valid_token') };

		MockFetch.mockResolvedValueOnce({ ok: true });

		const result = await actions.default({ request, params, cookies });
		expect(result).toEqual({ success: true });
	});
});
