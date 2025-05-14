import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../../../src/routes/api/stream_chat/+server';
import { json } from '@sveltejs/kit';

vi.mock('@sveltejs/kit', () => ({
  json: vi.fn(),
}));

describe('POST Handler - LLM Request', () => {
  let fetchMock: any;
  let cookiesMock: any;
  let requestMock: any;

  beforeEach(() => {
    fetchMock = vi.fn();
    global.fetch = fetchMock;
    cookiesMock = {
      get: vi.fn(),
    };
    requestMock = {
      json: vi.fn(),
    };
  });

  it('should throw an error if no request data is provided', async () => {
    requestMock.json.mockResolvedValueOnce(null); // No request data

    await expect(
      POST({ cookies: cookiesMock, request: requestMock, fetch: fetchMock })
    ).rejects.toThrowError('No request data');
  });

  it('should throw an error if the fetch response is not ok', async () => {
    requestMock.json.mockResolvedValueOnce({
      question: 'What is AI?',
      messages: [],
    });
    cookiesMock.get.mockReturnValueOnce('mock-token');
    fetchMock.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: { message: 'Invalid request' } }),
    });

    await expect(
      POST({ cookies: cookiesMock, request: requestMock})
    ).rejects.toThrowError('Invalid request');
  });

  it('should return the fetch response if successful', async () => {
    requestMock.json.mockResolvedValueOnce({
      question: 'What is AI?',
      messages: [],
    });
    cookiesMock.get.mockReturnValueOnce('mock-token');
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ answer: 'Artificial Intelligence' }),
    });

    const response = await POST({
      cookies: cookiesMock,
      request: requestMock,
      fetch: fetchMock,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      `http://localhost:3001`, // Replace `undefined` with the actual `PUBLIC_LLM_URL` in your environment
      {
        headers: {
          Authorization: 'Bearer mock-token',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          question: 'What is AI?',
          messages: [],
        }),
      }
    );

    const responseBody = await response.json();
    expect(responseBody).toEqual({ answer: 'Artificial Intelligence' });
  });
});