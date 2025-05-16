// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { actions, load } from '../../../src/routes/cambio-password/+page.server';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fail, redirect } from '@sveltejs/kit';
const MockFetch = vi.fn();
global.fetch = MockFetch;

vi.mock('$env/dynamic/public', () => ({
	env: {
		PUBLIC_DATABASE_URL: 'localhost:3000'
	}
}));

vi.mock('@sveltejs/kit', async () => {
	const actual = await import('@sveltejs/kit');
	return {
		...actual,
		fail: vi.fn((status, data) => ({ status, data })),
		redirect: vi.fn((status, location) => ({ status, location }))
	};
});


describe('Password Change Actions', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});


	it('should fail if passwords are missing', async () => {
		const formData = new FormData();
		formData.set('currentPassword', 'oldpass');

		const result = await actions.default({
			request: { formData: () => formData },
			cookies: { get: () => 'valid_token' }
		});

		expect(fail).toHaveBeenCalledWith(400, {
			error: 'Entrambi i campi password sono obbligatori'
		});
		expect(result.status).toBe(400);
	});

	it('should fail for passwords shorter than 8 characters', async () => {
		const formData = new FormData();
		formData.set('password', 'Short1');
		formData.set('passwordConfirm', 'Short1');
		formData.set('currentPassword', 'oldpass');

		const result = await actions.default({
			request: { formData: () => formData },
			cookies: { get: () => 'valid_token' }
		});

		expect(fail).toHaveBeenCalledWith(400, {
			error: 'La password deve essere lunga almeno 8 caratteri'
		});
		expect(result.status).toBe(400);
	});

	it('should fail if password lacks an uppercase letter', async () => {
		const formData = new FormData();
		formData.set('password', 'lowercase1!');
		formData.set('passwordConfirm', 'lowercase1!');
		formData.set('currentPassword', 'oldpass');

		const result = await actions.default({
			request: { formData: () => formData },
			cookies: { get: () => 'valid_token' }
		});

		expect(fail).toHaveBeenCalledWith(400, {
			error: 'La password deve contenere almeno una lettera maiuscola'
		});
		expect(result.status).toBe(400);
	});

	it('should fail if password lacks a lowercase letter', async () => {
		const formData = new FormData();
		formData.set('password', 'UPPERCASE1!');
		formData.set('passwordConfirm', 'UPPERCASE1!');
		formData.set('currentPassword', 'oldpass');

		const result = await actions.default({
			request: { formData: () => formData },
			cookies: { get: () => 'valid_token' }
		});

		expect(fail).toHaveBeenCalledWith(400, {
			error: 'La password deve contenere almeno una lettera minuscola'
		});
		expect(result.status).toBe(400);
	});

	it('should fail if password lacks a digit', async () => {
		const formData = new FormData();
		formData.set('password', 'NoDigits!');
		formData.set('passwordConfirm', 'NoDigits!');
		formData.set('currentPassword', 'oldpass');

		const result = await actions.default({
			request: { formData: () => formData },
			cookies: { get: () => 'valid_token' }
		});

		expect(fail).toHaveBeenCalledWith(400, {
			error: 'La password deve contenere almeno una cifra'
		});
		expect(result.status).toBe(400);
	});

	it('should fail if password lacks a special character', async () => {
		const formData = new FormData();
		formData.set('password', 'NoSpecial1');
		formData.set('passwordConfirm', 'NoSpecial1');
		formData.set('currentPassword', 'oldpass');

		const result = await actions.default({
			request: { formData: () => formData },
			cookies: { get: () => 'valid_token' }
		});

		expect(fail).toHaveBeenCalledWith(400, {
			error: 'La password deve contenere almeno un carattere speciale (es. !@#$%^&*())'
		});
		expect(result.status).toBe(400);
	});

	it('should make PATCH request and succeed', async () => {
		const formData = new FormData();
		formData.set('password', 'Strong1!');
		formData.set('passwordConfirm', 'Strong1!');
		formData.set('currentPassword', 'oldpass');

		MockFetch.mockResolvedValueOnce({
			ok: true,
			json: async () => ({})
		});

		const result = await actions.default({
			request: { formData: () => formData },
			cookies: { get: () => 'token123' }
		});

		expect(MockFetch).toHaveBeenCalledWith(
			'http://localhost:3000/users/password',
			expect.objectContaining({
				method: 'PATCH',
				headers: expect.objectContaining({
					Authorization: 'Bearer token123'
				})
			})
		);
		expect(result).toEqual({ success: true });
	});

	it('should handle API error response', async () => {
		const formData = new FormData();
		formData.set('password', 'Strong1!');
		formData.set('passwordConfirm', 'Strong1!');
		formData.set('currentPassword', 'wrongpass');

		MockFetch.mockResolvedValueOnce({
			ok: false,
			json: async () => ({ error: 'Invalid password' })
		});

		const result = await actions.default({
			request: { formData: () => formData },
			cookies: { get: () => 'token123' }
		});

		expect(result.status).toBe(400);
		expect(result.data.error).toMatch(/attuale non è corretta/);
	});
});
