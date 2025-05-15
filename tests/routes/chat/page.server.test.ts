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
	redirect: vi.fn((status: number, location: string) => {
    const error = new Error('Redirect');
    (error as any).status = status;
    (error as any).location = location;
    throw error;
  }),
	fail: vi.fn((status, data) => ({ status, data }))
}));

beforeEach(() => {
	vi.clearAllMocks();
});

const fakeParams = { id: 'chat123' };

beforeEach(() => {
  vi.clearAllMocks();
});
describe('load()', () => {
	it('redirects to /login if token is expired', async () => {
		const cookies = { get: () => 'expired_token', delete: vi.fn() };
		MockFetch.mockResolvedValueOnce({
			json: () => ({ detail: 'Token is invalid or expired' })
		});

		try {
			await load({ cookies, params: fakeParams });
		} catch (error: any) {
			expect(error.status).toBe(303);
			expect(error.location).toBe('/login');
		}
	});

	it('redirects to / if chat not found', async () => {
		MockFetch.mockResolvedValueOnce({
			json: () => ({ detail: 'Chat not found' })
		});

		try {
			await load({ cookies: { get: () => 'ok' }, params: fakeParams });
		} catch (error: any) {
			expect(error.status).toBe(303);
			expect(error.location).toBe('/');
		}
	});

	it('fails if updateChatNameIfNeeded fails', async () => {
		const chat = {
			name: 'Chat senza nome',
			messages: [{ content: 'a' }, { content: 'b' }, { content: 'c' }]
		};

		MockFetch
			.mockResolvedValueOnce({ json: () => chat }) // get chat
			.mockResolvedValueOnce({ ok: false, status: 500 }); // LLM returns error

		await load({ cookies: { get: () => 'has' }, params: fakeParams });
		expect(fail).toHaveBeenCalledWith(500, { error: 'Failed to generate chat name' });
	});

	it('returns chat and chat_id if successful', async () => {
		const chat = {
			name: 'Chat senza nome',
			messages: [{ content: 'hello' }, { content: 'world' }, { content: 'again' }]
		};

		MockFetch
			.mockResolvedValueOnce({ json: () => chat }) // fetch chat
			.mockResolvedValueOnce({ ok: true, json: () => 'New title' }) // /chat_name
			.mockResolvedValueOnce({ ok: true }); // patch name

		const result = await load({ cookies: { get: () => 'ok' }, params: fakeParams });
		expect(result?.chat).toBeDefined();
		expect(result?.chat_id).toBe('chat123');
	});
});
