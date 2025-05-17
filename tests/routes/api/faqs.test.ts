import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST, PUT, DELETE } from '../../../src/routes/api/faqs/+server';
import { json } from '@sveltejs/kit';

vi.mock('@sveltejs/kit', () => ({
  json: vi.fn(),
}));

describe('API Handlers - FAQs', () => {
  let fetchMock: any;
  let cookiesMock: any;
  let requestMock: any;

  beforeEach(() => {
    fetchMock = vi.fn();
    global.fetch = fetchMock;
    cookiesMock = {
      get: vi.fn(),
      delete: vi.fn(),
    };
    requestMock = {
      json: vi.fn(),
    };
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('POST Handler - Add FAQ', () => {
    it('should return 401 if no token is provided', async () => {
      cookiesMock.get.mockReturnValue(null);

      const result = await POST({ cookies: cookiesMock, request: requestMock, fetch: fetchMock });

      expect(result).toEqual(json({ error: 'Unauthorized' }, { status: 401 }));
    });

    it('should return 400 if required fields are missing', async () => {
      cookiesMock.get.mockReturnValue('valid-token');
      requestMock.json.mockResolvedValue({});

      const result = await POST({ cookies: cookiesMock, request: requestMock, fetch: fetchMock });

      expect(result).toEqual(
        json(
          { error: 'Dati non validi', details: 'Title, question and answer are required' },
          { status: 400 }
        )
      );
    });

    it('should return 401 if the token is invalid', async () => {
      cookiesMock.get.mockReturnValue('invalid-token');
      fetchMock.mockResolvedValueOnce({
        ok: false,
        json: vi.fn().mockResolvedValue({ error: 'Invalid token' }),
      });

      const result = await POST({ cookies: cookiesMock, request: requestMock, fetch: fetchMock });

      expect(result).toEqual(
        json(
          { error: 'Token non valido', details: { error: 'Invalid token' } },
          { status: 401 }
        )
      );
    });

    it('should return 200 and create the FAQ if everything is valid', async () => {
      cookiesMock.get.mockReturnValue('valid-token');
      requestMock.json.mockResolvedValue({
        title: 'Sample Title',
        question: 'Sample Question',
        answer: 'Sample Answer',
      });

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ id: 'new-faq-id' }),
      });

      const result = await POST({ cookies: cookiesMock, request: requestMock, fetch: fetchMock });

      expect(result).toEqual(
        json({
          success: true,
          faq: {
            _id: 'new-faq-id',
            title: 'Sample Title',
            question: 'Sample Question',
            answer: 'Sample Answer',
          },
          message: 'FAQ added successfully',
        })
      );
    });

    it('should return 500 if there is a server error', async () => {
      cookiesMock.get.mockReturnValue('valid-token');
      requestMock.json.mockResolvedValue({
        title: 'Sample Title',
        question: 'Sample Question',
        answer: 'Sample Answer',
      });

      fetchMock.mockRejectedValueOnce(new Error('Server Error'));

      const result = await POST({ cookies: cookiesMock, request: requestMock, fetch: fetchMock });

      expect(result).toEqual(json({ error: 'Internal server error' }, { status: 500 }));
    });
  });

  describe('PUT Handler - Update FAQ', () => {
    it('should return 401 if no token is provided', async () => {
      cookiesMock.get.mockReturnValue(null);

      const result = await PUT({ cookies: cookiesMock, request: requestMock, fetch: fetchMock });

      expect(result).toEqual(json({ error: 'Unauthorized' }, { status: 401 }));
    });

    it('should return 400 if required fields are missing', async () => {
      cookiesMock.get.mockReturnValue('valid-token');
      requestMock.json.mockResolvedValue({});

      const result = await PUT({ cookies: cookiesMock, request: requestMock, fetch: fetchMock });

      expect(result).toEqual(
        json(
          { error: 'Dati non validi', details: 'Title, question and answer are required' },
          { status: 400 }
        )
      );
    });

    it('should return 200 and update the FAQ if everything is valid', async () => {
      cookiesMock.get.mockReturnValue('valid-token');
      requestMock.json.mockResolvedValue({
        id: 'faq-id',
        title: 'Updated Title',
        question: 'Updated Question',
        answer: 'Updated Answer',
      });

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ id: 'faq-id' }),
      });

      const result = await PUT({ cookies: cookiesMock, request: requestMock, fetch: fetchMock });

      expect(result).toEqual(
        json({
          success: true,
          faq: {
            title: 'Updated Title',
            question: 'Updated Question',
            answer: 'Updated Answer',
          },
          message: 'FAQ updated successfully',
        })
      );
    });

    it('should return 500 if there is a server error', async () => {
      cookiesMock.get.mockReturnValue('valid-token');
      requestMock.json.mockResolvedValue({
        id: 'faq-id',
        title: 'Updated Title',
        question: 'Updated Question',
        answer: 'Updated Answer',
      });

      fetchMock.mockRejectedValueOnce(new Error('Server Error'));

      const result = await PUT({ cookies: cookiesMock, request: requestMock, fetch: fetchMock });

      expect(result).toEqual(json({ error: 'Internal server error' }, { status: 500 }));
    });
  });

  describe('DELETE Handler - Delete FAQ', () => {
    it('should return 401 if no token is provided', async () => {
      cookiesMock.get.mockReturnValue(null);

      const result = await DELETE({ cookies: cookiesMock, request: requestMock, fetch: fetchMock });

      expect(result).toEqual(json({ error: 'Unauthorized' }, { status: 401 }));
    });

    it('should return 400 if ID is missing', async () => {
      cookiesMock.get.mockReturnValue('valid-token');
      requestMock.json.mockResolvedValue({});

      const result = await DELETE({ cookies: cookiesMock, request: requestMock, fetch: fetchMock });

      expect(result).toEqual(
        json(
          { error: 'Dati non validi', details: 'ID is required' },
          { status: 400 }
        )
      );
    });

    it('should return 200 and delete the FAQ if everything is valid', async () => {
      cookiesMock.get.mockReturnValue('valid-token');
      requestMock.json.mockResolvedValue({
        id: 'faq-id',
        current_password: 'valid-password',
      });

      fetchMock.mockResolvedValueOnce({ ok: true });

      const result = await DELETE({ cookies: cookiesMock, request: requestMock, fetch: fetchMock });

      expect(result).toEqual(
        json({
          success: true,
          message: 'User deleted successfully',
        })
      );
    });

    it('should return 500 if there is a server error', async () => {
      cookiesMock.get.mockReturnValue('valid-token');
      requestMock.json.mockResolvedValue({
        id: 'faq-id',
        current_password: 'valid-password',
      });

      fetchMock.mockRejectedValueOnce(new Error('Server Error'));

      const result = await DELETE({ cookies: cookiesMock, request: requestMock, fetch: fetchMock });

      expect(result).toEqual(json({ error: 'Internal server error' }, { status: 500 }));
    });
  });







  

});


describe('Additional Tests for API Handlers - FAQs', () => {

  let fetchMock: any;
  let cookiesMock: any;
  let requestMock: any;

  beforeEach(() => {
    fetchMock = vi.fn();
    global.fetch = fetchMock;
    cookiesMock = {
      get: vi.fn(),
      delete: vi.fn(),
    };
    requestMock = {
      json: vi.fn().mockResolvedValue({
        title: 'Sample Title',
        question: 'Sample Question',
        answer: 'Sample Answer',
      }),
    };
   
  });
  
  describe('POST Handler - Add FAQ', () => {
    it('should return 401 if token verification fails', async () => {
      cookiesMock.get.mockReturnValue('invalid-token');
      globalThis.fetch = fetchMock;
      fetchMock.mockResolvedValueOnce({
        ok: false,
        json: vi.fn().mockResolvedValue({ error: 'Invalid token' }),
      });

      const result = await POST({ cookies: cookiesMock, request: requestMock, fetch: fetchMock });

      expect(result).toEqual(
        json(
          { error: 'Token non valido', details: { error: 'Invalid token' } },
          { status: 401 }
        )
      );
    });

    it('should return 500 if fetch to LLM_URL fails', async () => {
      cookiesMock.get.mockReturnValue('valid-token');
      requestMock.json.mockResolvedValue({
        title: 'Sample Title',
        question: 'Sample Question',
        answer: 'Sample Answer',
      });

      fetchMock.mockRejectedValueOnce(new Error('LLM Server Error'));

      const result = await POST({ cookies: cookiesMock, request: requestMock, fetch: fetchMock });

      expect(result).toEqual(json({ error: 'Internal server error' }, { status: 500 }));
    });
  });

  describe('PUT Handler - Update FAQ', () => {
    it('should return 401 if token verification fails', async () => {
      cookiesMock.get.mockReturnValue('invalid-token');
      fetchMock.mockResolvedValueOnce({
        ok: false,
        json: vi.fn().mockResolvedValue({ error: 'Invalid token' }),
      });

      const result = await PUT({ cookies: cookiesMock, request: requestMock, fetch: fetchMock });

      expect(result).toEqual(
        json(
          { error: 'Token non valido', details: { error: 'Invalid token' } },
          { status: 401 }
        )
      );
    });

    it('should return 400 if no ID is provided in the request', async () => {
      cookiesMock.get.mockReturnValue('valid-token');
      requestMock.json.mockResolvedValue({
        title: 'Updated Title',
        question: 'Updated Question',
        answer: 'Updated Answer',
      });

      const result = await PUT({ cookies: cookiesMock, request: requestMock, fetch: fetchMock });

      expect(result).toEqual(
        json(
          { error: 'Dati non validi', details: 'Title, question and answer are required' },
          { status: 400 }
        )
      );
    });

    it('should return 409 if no changes are made to the FAQ', async () => {
      cookiesMock.get.mockReturnValue('valid-token');
      requestMock.json.mockResolvedValue({
        id: 'faq-id',
        title: 'Updated Title',
        question: 'Updated Question',
        answer: 'Updated Answer',
      });

      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 409,
        json: vi.fn().mockResolvedValue({ detail: 'FAQ data is already up to date' }),
      });

      const result = await PUT({ cookies: cookiesMock, request: requestMock, fetch: fetchMock });

      expect(result).toEqual(
        json(
          { error: 'Nessuna modifica apportata', details: { detail: 'FAQ data is already up to date' } },
          { status: 409 }
        )
      );
    });
  });

  describe('DELETE Handler - Delete FAQ', () => {
    it('should return 401 if token verification fails', async () => {
      cookiesMock.get.mockReturnValue('invalid-token');
      fetchMock.mockResolvedValueOnce({
        ok: false,
        json: vi.fn().mockResolvedValue({ error: 'Invalid token' }),
      });

      const result = await DELETE({ cookies: cookiesMock, request: requestMock, fetch: fetchMock });

      expect(result).toEqual(
        json(
          { error: 'Token non valido', details: { error: 'Invalid token' } },
          { status: 401 }
        )
      );
    });

    it('should return 401 if the current password is incorrect', async () => {
      cookiesMock.get.mockReturnValue('valid-token');
      requestMock.json.mockResolvedValue({
        id: 'faq-id',
        current_password: 'wrong-password',
      });
      globalThis.fetch = fetchMock;
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: vi.fn().mockResolvedValue({ error: 'Password errata' }),
      });

      const result = await DELETE({ cookies: cookiesMock, request: requestMock, fetch: fetchMock });

      expect(result).toEqual(
        json({ error: 'Password errata', details: 'Password errata' }, { status: 401 })
      );
    });

    it('should return 500 if fetch to DATABASE_URL fails', async () => {
      cookiesMock.get.mockReturnValue('valid-token');
      globalThis.fetch = fetchMock;
      requestMock.json.mockResolvedValue({
        id: 'faq-id',
        current_password: 'valid-password',
      });

      fetchMock.mockRejectedValueOnce(new Error('Database Server Error'));

      const result = await DELETE({ cookies: cookiesMock, request: requestMock, fetch: fetchMock });

      expect(result).toEqual(json({ error: 'Internal server error' }, { status: 500 }));
    });
  });
});