import { load } from '../../src/routes/+layout.server';
import { vi } from 'vitest';
import { fail } from '@sveltejs/kit';

vi.mock('$lib/utils/logger', () => ({
  logger: {
    info: vi.fn(),
    debug: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('@sveltejs/kit', () => ({
  fail: vi.fn(),
}));

describe('load function', () => {
  const mockCookies = {
    get: vi.fn(),
  };

  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return settings and theme when fetch is successful', async () => {
    mockCookies.get.mockReturnValue('dark');
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        color_primary: '#123456',
        color_primary_hover: '#654321',
        color_primary_text: '#ffffff',
        message_history: 100,
      }),
    });

    const result = await load({ cookies: mockCookies, fetch: mockFetch } as any);

    expect(result).toEqual({
      settings: {
        COLOR_PRIMARY: '#123456',
        COLOR_PRIMARY_HOVER: '#654321',
        COLOR_PRIMARY_TEXT: '#ffffff',
        CHAT_HISTORY: 100,
      },
      theme: 'dark',
    });
  });

  it('should return default settings and theme when fetch fails', async () => {
    mockCookies.get.mockReturnValue(undefined);
    mockFetch.mockRejectedValueOnce(new Error('Fetch failed'));

    const result = await load({ cookies: mockCookies, fetch: mockFetch } as any);

    expect(result).toEqual({
      settings: {
        COLOR_PRIMARY: '#0dab44',
        COLOR_PRIMARY_HOVER: '#09772f',
        COLOR_PRIMARY_TEXT: '#ffffff',
        CHAT_HISTORY: 50,
      },
      theme: 'light',
    });
  });

  it('should call fail when fetch returns a non-OK response', async () => {
    mockCookies.get.mockReturnValue('light');
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Internal Server Error' }),
    });

    const result = await load({ cookies: mockCookies, fetch: mockFetch } as any);

    expect(fail).toHaveBeenCalledWith(500, {
      error: 'Failed to fetch settings',
      details: { error: 'Internal Server Error' },
    });
    expect(result).toBeUndefined();
  });
});
