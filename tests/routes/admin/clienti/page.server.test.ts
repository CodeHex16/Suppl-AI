import { describe, it, expect, vi } from 'vitest';
import { load } from '../../../../src/routes/admin/clienti/+page.server';
import { error } from '@sveltejs/kit';

vi.mock('@sveltejs/kit', () => ({
  error: vi.fn((status, message) => ({ status, message }))
}));

describe('PageServerLoad', () => {
  const mockFetch = vi.fn();
  const mockCookies = {
    get: vi.fn()
  };

  const DATABASE_URL = 'mock-database-url';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw 401 error if token is missing', async () => {
    mockCookies.get.mockReturnValue(undefined);

    await expect(
      load({ fetch: mockFetch, cookies: mockCookies })
    ).rejects.toEqual(error(401, 'Autenticazione richiesta'));

    expect(mockCookies.get).toHaveBeenCalledWith('token');
  });

  it('should throw error if users fetch fails', async () => {
    mockCookies.get.mockReturnValue('mock-token');
    mockFetch
      .mockResolvedValueOnce({ ok: false, status: 500, text: async () => 'Server error' })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ _id: 'me-id', name: 'Me', scopes: ['admin'] }) });

    await expect(
      load({ fetch: mockFetch, cookies: mockCookies })
    ).rejects.toEqual(error(500, 'Impossibile caricare la lista utenti'));

    expect(mockFetch).toHaveBeenCalledWith(`http://localhost:3000/users`, {
      method: 'GET',
      headers: { Authorization: 'Bearer mock-token' }
    });
  });

  it('should throw error if me fetch fails', async () => {
    mockCookies.get.mockReturnValue('mock-token');
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce({ ok: false, status: 500, text: async () => 'Server error' });

    await expect(
      load({ fetch: mockFetch, cookies: mockCookies })
    ).rejects.toEqual(error(500, 'Impossibile caricare i dati utente corrente'));

    expect(mockFetch).toHaveBeenCalledWith(`http://localhost:3000/users/me`, {
      method: 'GET',
      headers: { Authorization: 'Bearer mock-token' }
    });
  });

  it('should return users and me data correctly', async () => {
    mockCookies.get.mockReturnValue('mock-token');
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { _id: 'user1', name: 'User One', scopes: ['user'] },
          { _id: 'user2', name: 'User Two', scopes: ['admin'] }
        ]
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ _id: 'me-id', name: 'Me', scopes: ['admin'] })
      });

    const result = await load({ fetch: mockFetch, cookies: mockCookies });

    expect(result).toEqual({
      users: [
        { email: 'user1', name: 'User One', role: 'user' },
        { email: 'user2', name: 'User Two', role: 'admin' }
      ],
      me: { email: 'me-id', name: 'Me', role: 'admin' }
    });

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('should filter out invalid user data', async () => {
    mockCookies.get.mockReturnValue('mock-token');
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { _id: 'user1', name: 'User One', scopes: ['user'] },
          { _id: null, name: 'Invalid User', scopes: [] },
          { _id: 'user2', name: 'User Two', scopes: ['admin'] }
        ]
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ _id: 'me-id', name: 'Me', scopes: ['admin'] })
      });

    const result = await load({ fetch: mockFetch, cookies: mockCookies });

    expect(result).toEqual({
      users: [
        { email: 'user1', name: 'User One', role: 'user' },
        { email: 'user2', name: 'User Two', role: 'admin' }
      ],
      me: { email: 'me-id', name: 'Me', role: 'admin' }
    });

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});