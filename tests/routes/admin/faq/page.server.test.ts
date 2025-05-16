import { describe, it, expect, vi } from 'vitest';
import { load } from '../../../../src/routes/admin/faq/+page.server';
import { error } from '@sveltejs/kit';

vi.mock('$env/dynamic/public', () => ({
	env: { PUBLIC_DATABASE_URL: 'mock-database-url' }
}));

describe('load function', () => {
	const mockFetch = vi.fn();
	const mockCookies = {
		get: vi.fn()
	};

	const createMockContext = (token: string | null) => ({
		fetch: mockFetch,
		cookies: {
			get: vi.fn(() => token)
		}
	});

	it('should throw 401 error if token is missing', async () => {
		const context = createMockContext(null);

		await expect(load(context)).rejects.toThrow(
      expect.objectContaining({
        status: 401
      })
    );
	});

	it('should return empty faqs array if API returns 404', async () => {
		const context = createMockContext('mock-token');
		mockFetch.mockResolvedValueOnce({
			ok: false,
			status: 404
		});

		const result = await load(context);
		expect(result).toEqual({ faqs: [] });
	});

	it('should throw 403 error if API returns 403', async () => {
		const context = createMockContext('mock-token');
		mockFetch.mockResolvedValueOnce({
			ok: false,
			status: 403,
			text: async () => 'Access denied'
		});

		await expect(load(context)).rejects.toThrow(expect.objectContaining({
      status: 403,
    }));
	});

	it('should throw an error if API response is not ok and not 404/403', async () => {
		const context = createMockContext('mock-token');
		mockFetch.mockResolvedValueOnce({
			ok: false,
			status: 500,
			text: async () => 'Internal Server Error'
		});

		await expect(load(context)).rejects.toThrow(
      expect.objectContaining({
        status: 500,
      })
    );
	});

	it('should throw 500 error if API response is not an array', async () => {
		const context = createMockContext('mock-token');
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: async () => ({ invalid: 'data' })
		});

		await expect(load(context)).rejects.toThrow(
      expect.objectContaining({
        status: 500,
      })
    );
	});

	it('should return faqs if API response is valid', async () => {
		const context = createMockContext('mock-token');
		const mockFaqs = [{ id: 1, question: 'What is this?', answer: 'A test.' }];
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: async () => mockFaqs
		});

		const result = await load(context);
		expect(result).toEqual({ faqs: mockFaqs });
	});
});