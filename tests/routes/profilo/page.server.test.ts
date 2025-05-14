import { describe, it, expect, vi } from 'vitest';
import { load } from '../../../src/routes/profilo/+page.server';
import { redirect } from '@sveltejs/kit';


vi.mock('@sveltejs/kit', async () => {
	const actual = await vi.importActual('@sveltejs/kit');
	return {
		...actual,
		redirect: vi.fn()
	};
});

describe('load', () => {
	it('redirects if no token is found', async () => {
		const cookies = {
			get: vi.fn().mockReturnValue(undefined)
		};

		await load({ cookies });

		expect(redirect).toHaveBeenCalledWith(303, '/');
	});

	it('returns user credentials if token exists', async () => {
		const fakeUser = { id: '123', email: 'test@example.com' };
		const cookies = {
			get: vi.fn().mockReturnValue('fake-token')
		};

		global.fetch = vi.fn().mockResolvedValue({
			json: vi.fn().mockResolvedValue(fakeUser)
		});

		const result = await load({ cookies });
		expect(result).toEqual({ creds: fakeUser });

		expect(fetch).toHaveBeenCalledWith(
			expect.stringContaining('/users/me'),
			expect.objectContaining({
				method: 'GET',
				headers: expect.objectContaining({
					Authorization: 'Bearer fake-token'
				})
			})
		);
	});
});
