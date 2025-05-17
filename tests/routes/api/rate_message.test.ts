import { vi, describe, it, expect, beforeEach } from 'vitest';
import { POST } from '../../../src/routes/api/rate_message/+server';
import { json } from '@sveltejs/kit';
vi.mock('@sveltejs/kit', () => ({
  json: vi.fn(),
}));

describe('POST Handler - Update Rating', () => {
  let fetchMock: any;
  let cookiesMock: any;
  let requestMock: any;

  beforeEach(() => {
    fetchMock = vi.fn();
    cookiesMock = {
      get: vi.fn(),
    };
    requestMock = {
      json: vi.fn(),
    };
  });

  it('should return 401 if no token is provided', async () => {
    cookiesMock.get.mockReturnValue(null); // No token
    
    const result = await POST({ cookies: cookiesMock, request: requestMock });

    expect(result).toEqual(json({ error: 'Unauthorized' }, { status: 401 }));
  });

  it('should return 400 if missing required fields in the request body', async () => {
    cookiesMock.get.mockReturnValue('valid-token');
    requestMock.json.mockResolvedValue({}); // Missing chat_id, message_id, and rating
    
    const result = await POST({ cookies: cookiesMock, request: requestMock });

    expect(result).toEqual(json({
      error: 'Bad Request',
      details: 'chat_id, message_id, and rating are required'
    }, { status: 400 }));
  });

  it('should return 401 if the token is invalid', async () => {
    cookiesMock.get.mockReturnValue('invalid-token');
    fetchMock.mockResolvedValueOnce({ ok: false, json: vi.fn().mockResolvedValue({ error: 'Invalid token' }) });

    const result = await POST({ cookies: cookiesMock, request: requestMock, fetch: fetchMock });

    expect(result).toEqual(json({
      error: 'Failed to update rating',
      details: { error: 'Invalid token' }
    }, { status: 401 }));
  });

  it('should return 200 and successfully update the rating if the request is valid', async () => {
    cookiesMock.get.mockReturnValue('valid-token');
    requestMock.json.mockResolvedValue({
      chat_id: 'chat-id',
      message_id: 'message-id',
      rating: 5,
    });

    fetchMock.mockResolvedValueOnce({ ok: true, json: vi.fn().mockResolvedValue({}) });

    const result = await POST({ cookies: cookiesMock, request: requestMock, fetch: fetchMock });

    expect(result).toEqual(json({ success: true }));
  });

  it('should return 500 if there is an internal server error', async () => {
    cookiesMock.get.mockReturnValue('valid-token');
    requestMock.json.mockResolvedValue({
      chat_id: 'chat-id',
      message_id: 'message-id',
      rating: 5,
    });

    fetchMock.mockRejectedValueOnce(new Error('Server Error'));

    const result = await POST({ cookies: cookiesMock, request: requestMock, fetch: fetchMock });

    expect(result).toEqual(json({ error: 'Internal server error' }, { status: 500 }));
  });

  it('should return 400 if the database responds with an error', async () => {
    cookiesMock.get.mockReturnValue('valid-token');
    requestMock.json.mockResolvedValue({
      chat_id: 'chat-id',
      message_id: 'message-id',
      rating: 5,
    });

    fetchMock.mockResolvedValueOnce({
      ok: false,
      json: vi.fn().mockResolvedValue({ error: 'Failed to update rating' }),
    });

    const result = await POST({ cookies: cookiesMock, request: requestMock, fetch: fetchMock });

    expect(result).toEqual(json({
      error: 'Failed to update rating',
      details: { error: 'Failed to update rating' }
    }, { status: 400 }));
  });

  
it('should handle the case where the response is not ok and contains error details', async () => {
  cookiesMock.get.mockReturnValue('valid-token');
  requestMock.json.mockResolvedValue({
    chat_id: 'chat-id',
    message_id: 'message-id',
    rating: 5,
  });
  globalThis.fetch = fetchMock;
  fetchMock.mockResolvedValueOnce({
    ok: false,
    status: 422,
    json: vi.fn().mockResolvedValue({ error: 'Invalid rating value' }),
  });

  const result = await POST({ cookies: cookiesMock, request: requestMock, fetch: fetchMock });

  expect(result).toEqual(json({
    error: 'Failed to update rating',
    details: { error: 'Invalid rating value' }
  }, { status: 422 }));
});
});
