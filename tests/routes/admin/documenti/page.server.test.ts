import { describe, it, expect, vi } from 'vitest';
import { load } from '../../../../src/routes/admin/documenti/+page.server';
import { redirect } from '@sveltejs/kit';

vi.mock('$env/dynamic/public', () => ({
  env: {
    PUBLIC_DATABASE_URL: 'mock-database-url',
  },
}));

describe('load function', () => {
  const mockFetch = vi.fn();
  global.fetch = mockFetch;

  const mockCookies = {
    get: vi.fn(),
    delete: vi.fn(),
  };

  const mockData = {
    cookies: mockCookies,
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should redirect to /login if token is missing', async () => {
    mockCookies.get.mockReturnValue(null);
    await load(mockData);
    expect(redirect).toHaveBeenCalledWith(303, '/login');
    expect(mockCookies.get).toHaveBeenCalledWith('token');
  });

  it('should return empty documents array if no documents are found', async () => {
    mockCookies.get.mockReturnValue('mock-token');
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ detail: 'Nessun documento trovato' }),
    });

    const result = await load(mockData);

    expect(result).toEqual({ documents: [] });
    expect(mockFetch).toHaveBeenCalledWith('http://mock-database-url/documents', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer mock-token',
      },
    });
  });

  it('should throw an error and delete token if token is invalid', async () => {
    mockCookies.get.mockReturnValue('mock-token');
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ detail: 'Token non valido' }),
    });

    await expect(load(mockData)).rejects.toThrow('Token non valido');
    expect(mockCookies.delete).toHaveBeenCalledWith('token', { path: '/' });
  });

  it('should return documents data if fetch is successful', async () => {
    const mockDocuments = [{ id: 1, name: 'Document 1' }];
    mockCookies.get.mockReturnValue('mock-token');
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockDocuments,
    });

    const result = await load(mockData);

    expect(result).toEqual({ documents: mockDocuments });
    expect(mockFetch).toHaveBeenCalledWith('http://mock-database-url/documents', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer mock-token',
      },
    });
  });

});