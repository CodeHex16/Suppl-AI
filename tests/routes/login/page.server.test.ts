import { describe, it, expect, vi, beforeEach } from 'vitest';
import { actions, load } from '../../../src/routes/login/+page.server';
import { redirect, fail } from '@sveltejs/kit';

vi.mock('$env/dynamic/public', () => ({
	env: {
		PUBLIC_DATABASE_URL: 'localhost:8000'
	}
}));

const mockFetch = vi.fn();
const mockCookies = {
	get: vi.fn(),
	set: vi.fn()
};

beforeEach(() => {
	vi.restoreAllMocks();
	mockFetch.mockReset();
	mockCookies.get.mockReset();
	mockCookies.set.mockReset();
});

describe('load', () => {
	it('should redirect if token is present', async () => {
		mockCookies.get.mockReturnValue('mock_token');
    await load({ cookies: mockCookies });
    expect(redirect).toHaveBeenCalledWith(303, '/');
	});
});

describe('actions.default', () => {
	it('should return 400 if username or password is missing', async () => {
		const request = {
			formData: async () => new FormData()
		};
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
		const result = await actions.default!({ request, cookies: mockCookies });
		expect(result).toEqual(fail(400, { error: 'Username e password sono richiesti' }));
	});

	it('should return 403 if credentials are invalid', async () => {
		const formData = new FormData();
		formData.set('username', 'invalid_user');
		formData.set('password', 'wrong_password');
		formData.set('remember_me', 'on');

		global.fetch = vi.fn().mockResolvedValue({
			ok: false,
			json: async () => ({ detail: 'Invalid credentials' })
		});

		const request = { formData: async () => formData };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
		const result = await actions.default!({ request, cookies: mockCookies });
		expect(result).toEqual(
			fail(403, { error: 'Credenziali non valide', dettagli: JSON.stringify({ detail: 'Invalid credentials' }) })
		);
	});

	it('should return 500 if fetch fails', async () => {
		const formData = new FormData();
		formData.set('username', 'user');
		formData.set('password', 'pass');
		formData.set('remember_me', 'off');

		global.fetch = vi.fn().mockRejectedValue(new Error('network error'));

		const request = { formData: async () => formData };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
		const result = await actions.default!({ request, cookies: mockCookies });
		expect(result).toEqual(fail(500, { error: 'Errore di connessione al server' }));
	});

	it('should set cookie and redirect on success', async () => {
		const formData = new FormData();
		formData.set('username', 'user');
		formData.set('password', 'pass');
		formData.set('remember_me', 'on');

		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: async () => ({
				access_token: 'mock_token',
				expires_in: 3600
			})
		});

		const request = { formData: async () => formData };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
		const result = await actions.default!({ request, cookies: mockCookies });
		expect(mockCookies.set).toHaveBeenCalledWith('token', 'mock_token', expect.objectContaining({
			maxAge: 3600
		}));
		expect(result).toEqual(redirect(303, '/'));
	});
});
