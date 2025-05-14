import { describe, it, expect, vi } from 'vitest';
import { actions } from '../../../src/routes/recupero-password/+page.server';

vi.mock('$env/dynamic/public', () => ({
	env: {
		PUBLIC_DATABASE_URL: 'localhost:3000'
	}
}));

describe('Password recovery actions.default', () => {
	it('returns 400 if email is missing', async () => {
		const formData = new FormData();
		const request = { method: 'POST', formData: () => formData };
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const result = await actions.default({ request, fetch: vi.fn() });
		expect(result?.status).toBe(400);
		expect(result?.data.error).toBe("Inserisci un'email valida");
	});

	it('returns 400 if email is invalid', async () => {
		const formData = new FormData();
		formData.set('email', 'invalid-email');
		const request = { method: 'POST', formData: () => formData };
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const result = await actions.default({ request, fetch: vi.fn() });
		expect(result?.status).toBe(400);
	});

	it('returns 404 if user not found', async () => {
		const formData = new FormData();
		formData.set('email', 'test@example.com');

		const request = { method: 'POST', formData: () => formData };
		const fetch = vi.fn().mockResolvedValue({
			ok: false,
			json: async () => ({ detail: 'User not found' })
		});
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const result = await actions.default({ request, fetch });
		expect(result?.status).toBe(404);
		expect(result?.data.error).toMatch(/non è associata/);
	});

	it('returns 500 if fetch throws error', async () => {
		const formData = new FormData();
		formData.set('email', 'test@example.com');

		const request = { method: 'POST', formData: () => formData };
		const fetch = vi.fn().mockRejectedValue(new Error('Connection error'));
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const result = await actions.default({ request, fetch });
		expect(result?.status).toBe(500);
		expect(result?.data.error).toMatch(/Errore di connessione/);
	});

	it('returns success on valid request', async () => {
		const formData = new FormData();
		formData.set('email', 'test@example.com');

		const request = { method: 'POST', formData: () => formData };
		const fetch = vi.fn().mockResolvedValue({ ok: true });
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const result = await actions.default({ request, fetch });
		expect(result).toEqual({ success: true });
	});
});
