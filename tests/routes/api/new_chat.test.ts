import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../../../src/routes/api/new_chat/+server';
import { json } from '@sveltejs/kit';

vi.mock('@sveltejs/kit', () => ({
  json: vi.fn(),
}));

describe('GET Handler for Creating a New Chat', () => {
  let fetchMock: any;
  let cookiesMock: any;

  beforeEach(() => {
    fetchMock = vi.fn();
    cookiesMock = {
      get: vi.fn(),
    };
  });

  it('should return 401 if no token is provided', async () => {
    cookiesMock.get.mockReturnValue(null); // No token
    
    const result = await GET({ cookies: cookiesMock, fetch: fetchMock });

    expect(result).toEqual(json({ error: 'Unauthorized' }, { status: 401 }));
  });

  it('should return 401 if the token is invalid', async () => {
    cookiesMock.get.mockReturnValue('invalid-token'); // Invalid token
    fetchMock.mockResolvedValueOnce({ ok: false, json: vi.fn().mockResolvedValue({ error: 'Invalid token' }) });

    const result = await GET({ cookies: cookiesMock, fetch: fetchMock });

    expect(result).toEqual(json({ error: 'Errore durante la creazione della nuova chat', details: { error: 'Invalid token' } }, { status: 401 }));
  });

  it('should return 500 if the external service fails', async () => {
    cookiesMock.get.mockReturnValue('valid-token'); // Valid token
    fetchMock.mockResolvedValueOnce({ ok: false, json: vi.fn().mockResolvedValue({ error: 'Internal error' }) });

    const result = await GET({ cookies: cookiesMock, fetch: fetchMock });

    expect(result).toEqual(json({ error: 'Internal server error' }, { status: 500 }));
  });

  it('should return 200 and chat id if chat creation is successful', async () => {
    cookiesMock.get.mockReturnValue('valid-token'); // Valid token
    fetchMock.mockResolvedValueOnce({ 
      ok: true, 
      json: vi.fn().mockResolvedValue({ chat_id: 'new-chat-id' }) 
    });

    const result = await GET({ cookies: cookiesMock, fetch: fetchMock });

    expect(result).toEqual(json({ success: true, chat_id: 'new-chat-id' }));
  });
});
