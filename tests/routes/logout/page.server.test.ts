import { describe, it, expect, vi } from 'vitest';
import { load } from '../../../src/routes/logout/+page.server'; // 请根据你的实际路径调整
import { redirect } from '@sveltejs/kit';

vi.mock('@sveltejs/kit', async () => {
	const actual = await vi.importActual('@sveltejs/kit');
	return {
		...actual,
		redirect: vi.fn(() => {
			throw new Error('Redirect called');
		})
	};
});

describe('logout load function', () => {
	it('deletes token and redirects to home', async () => {
		const deleteMock = vi.fn();
		const cookies = {
			delete: deleteMock
		};

		try {
			await load({ cookies });
		} catch {
			expect(deleteMock).toHaveBeenCalledWith('token', { path: '/' });
			expect(redirect).toHaveBeenCalledWith(303, '/');
		}
	});
});
