import { describe, it, expect, vi } from 'vitest';
import { POST } from '../../../src/routes/api/get_stats/+server';
import { logger } from '$lib/utils/logger';



vi.mock('$env/dynamic/public', () => ({
  env: {
    PUBLIC_DATABASE_URL: 'mock-database-url',
  },
}));

describe('POST /api/get_stats', () => {
  const mockFetch = vi.fn();
  const mockCookies = {
    get: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = mockFetch;
  });

  it('should log an error and throw if no request data is provided', async () => {
    const mockRequest = {
      json: vi.fn().mockResolvedValue(null),
    };

    await expect(
      POST({ request: mockRequest as any, cookies: mockCookies as any })
    ).rejects.toThrow('No request data');

  });

  it('should make a GET request to the database with query parameters', async () => {
    const mockRequest = {
      json: vi.fn().mockResolvedValue({
        startDate: '2023-01-01',
        endDate: '2023-01-31',
      }),
    };

    mockCookies.get.mockReturnValue('mock-token');
    mockFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ data: 'mock-stats' }),
    });

    const response = await POST({
      request: mockRequest as any,
      cookies: mockCookies as any,
    });

    expect(mockFetch).toHaveBeenCalledWith(
      'http://mock-database-url/chats/stats?startDate=2023-01-01&endDate=2023-01-31',
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer mock-token',
          'Content-Type': 'application/json',
        },
      }
    );

    expect(response.status).toBe(200);
  });

  it('should handle database errors gracefully', async () => {
    const mockRequest = {
      json: vi.fn().mockResolvedValue({
        startDate: '2023-01-01',
        endDate: '2023-01-31',
      }),
    };

    mockCookies.get.mockReturnValue('mock-token');
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: vi.fn().mockResolvedValue({ error: 'Internal Server Error' }),
    });

    const response = await POST({
      request: mockRequest as any,
      cookies: mockCookies as any,
    });

   
    expect(response.status).toBe(500);
  });

  it('should handle invalid JSON response from the database', async () => {
    const mockRequest = {
      json: vi.fn().mockResolvedValue({
        startDate: '2023-01-01',
        endDate: '2023-01-31',
      }),
    };

    mockCookies.get.mockReturnValue('mock-token');
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
    });

    const response = await POST({
      request: mockRequest as any,
      cookies: mockCookies as any,
    });

    
    expect(response.status).toBe(500);
  });
});