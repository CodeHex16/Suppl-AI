import { POST, PUT, DELETE } from '../../../src/routes/api/users/+server';
import { describe, it, expect, vi } from 'vitest';

global.fetch = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
});

describe('API Handlers', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('POST /api/users', () => {
    it('should create a new user successfully', async () => {
      const mockCookies = {
        get: vi.fn().mockReturnValue('valid-token'),
      };

      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          name: 'John Doe',
          email: 'john.doe@example.com',
          role: ['admin'],
        }),
      };

      global.fetch
        .mockResolvedValueOnce({ ok: true }) // Token verification
        .mockResolvedValueOnce({ ok: true }); // User creation

      const response = await POST({
        request: mockRequest as any,
        cookies: mockCookies as any,
      });

      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(response.status).toBe(200);
      const responseBody = await response.json();
      expect(responseBody).toEqual({
        success: true,
        user: { name: 'John Doe', email: 'john.doe@example.com', role: ['admin'] },
        message: 'User added successfully',
      });
    });

    it('should return 401 if token is missing', async () => {
      const mockCookies = {
        get: vi.fn().mockReturnValue(''),
      };

      const mockRequest = {
        json: vi.fn(),
      };

      const response = await POST({
        request: mockRequest as any,
        cookies: mockCookies as any,
      });

      const responseBody = await response.json().catch(() => {});
      expect(responseBody).toEqual(expect.objectContaining({ error: 'Unauthorized' }));
    });

    it('should return error if token verification fails', async () => {
      const mockCookies = {
        get: vi.fn().mockReturnValue('invalid-token'),
        delete: vi.fn(),
      };

      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          name: 'John Doe',
          email: 'john.doe@example.com',
          scope: 'admin',
        }),
      };

      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: vi.fn().mockResolvedValue({ error: 'Invalid token' }),
      });

      const response = await POST({
        request: mockRequest as any,
        cookies: mockCookies as any,
      });

      expect(global.fetch).toHaveBeenCalledTimes(1);
      const responseBody = await response.json();
      expect(responseBody).toEqual({
        error: 'Token non valido',
        details: { error: 'Invalid token' },
      });
    });
  });

  describe('PUT /api/users', () => {
    it('should update a user successfully', async () => {
      const mockCookies = {
        get: vi.fn().mockReturnValue('valid-token'),
        delete: vi.fn(),
      };

      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          name: 'Jane Doe',
          // email: 'jane.doe@example.com',
          // scope: 'user',
          admin_password: 'admin123',
        }),
      };

      global.fetch
        .mockResolvedValueOnce({ ok: true }) // Token verification
        .mockResolvedValueOnce({ ok: true }); // User update

      const response = await PUT({
        request: mockRequest as any,
        cookies: mockCookies as any,
      });

      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(response.status).toBe(200);
      const responseBody = await response.json();
      expect(responseBody.success).toBe(true);
    });

    it('should return error if token verification fails', async () => {
      const mockCookies = {
        get: vi.fn().mockReturnValue(''),
        delete: vi.fn(),
      };

      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          name: 'Jane Doe',
          email: 'jane.doe@example.com',
          scope: 'editor',
        }),
      };

      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: vi.fn().mockResolvedValue({ error: 'Invalid token' }),
      });

      const response = await PUT({
        request: mockRequest as any,
        cookies: mockCookies as any,
      });
      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/users', () => {
    it('should delete a user successfully', async () => {
      const mockCookies = {
        get: vi.fn().mockReturnValue('valid-token'),

      };

      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          userId: '12345',
          current_password: 'password123',
        }),
      };

      global.fetch
        .mockResolvedValueOnce({ ok: true }) // Token verification
        .mockResolvedValueOnce({ ok: true }); // User deletion

      const response = await DELETE({
        request: mockRequest as any,
        cookies: mockCookies as any,
      });

      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(response.status).toBe(200);
      const responseBody = await response.json();
      expect(responseBody).toEqual({
        success: true,
        message: 'User deleted successfully',
      });
    });

    it('should return error if token verification fails', async () => {
      const mockCookies = {
        get: vi.fn().mockReturnValue(''),
        delete: vi.fn(),
      };

      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          userId: '12345',
          current_password: 'password123',
        }),
      };

      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: vi.fn().mockResolvedValue({ error: 'Invalid token' }),
      });

      const response = await DELETE({
        request: mockRequest as any,
        cookies: mockCookies as any,
      });


      expect(response.status).toBe(401);
      
    });
  });
});
describe('Additional API Handlers Tests', () => {
  describe('POST /api/users', () => {
    it('should return 400 if user creation fails with bad request', async () => {
      const mockCookies = {
        get: vi.fn().mockReturnValue('valid-token'),
      };

      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          name: 'Invalid User',
          email: 'invalid.email',
          role: ['user'],
        }),
      };

      global.fetch
        .mockResolvedValueOnce({ ok: true }) // Token verification
        .mockResolvedValueOnce({
          ok: false,
          status: 400,
          json: vi.fn().mockResolvedValue({ detail: 'Invalid data' }),
        }); // User creation fails

      const response = await POST({
        request: mockRequest as any,
        cookies: mockCookies as any,
      });

      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(response.status).toBe(400);
      const responseBody = await response.json();
      expect(responseBody).toEqual({
        error: 'Invalid data',
      });
    });

    it('should return 422 if user creation fails with unprocessable entity', async () => {
      const mockCookies = {
        get: vi.fn().mockReturnValue('valid-token'),
      };

      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          name: 'Invalid User',
          email: 'invalid.email',
          role: ['user'],
        }),
      };

      global.fetch
        .mockResolvedValueOnce({ ok: true }) // Token verification
        .mockResolvedValueOnce({
          ok: false,
          status: 422,
          json: vi.fn().mockResolvedValue({}),
        }); // User creation fails

      const response = await POST({
        request: mockRequest as any,
        cookies: mockCookies as any,
      });

      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(response.status).toBe(422);
      const responseBody = await response.json();
      expect(responseBody).toEqual({
        error: 'Dati inseriti non validi',
      });
    });
  });

  describe('PUT /api/users', () => {
    it('should return 401 if admin password is missing', async () => {
      const mockCookies = {
        get: vi.fn().mockReturnValue('valid-token'),
      };

      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          name: 'Jane Doe',
          email: 'jane.doe@example.com',
          role: 'editor',
        }),
      };

      const response = await PUT({
        request: mockRequest as any,
        cookies: mockCookies as any,
      });

      expect(response.status).toBe(401);
      const responseBody = await response.json();
      expect(responseBody).toEqual({
        error: 'Unauthorized',
      });
    });

    it('should return 304 if no changes are made during update', async () => {
      const mockCookies = {
        get: vi.fn().mockReturnValue('valid-token'),
      };

      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          name: 'Jane Doe',
          email: 'jane.doe@example.com',
          role: 'editor',
          admin_password: 'admin123',
        }),
      };

      global.fetch
        .mockResolvedValueOnce({ ok: true }) // Token verification
        .mockResolvedValueOnce({
          ok: false,
          status: 304,
          json: vi.fn().mockResolvedValue({}),
        }); // No changes made

      const response = await PUT({
        request: mockRequest as any,
        cookies: mockCookies as any,
      });

      expect(global.fetch).toHaveBeenCalledTimes(2);
      const responseBody = await response.json();
      expect(responseBody).toEqual({
        error: 'Nessuna modifica fatta',
        details: 'No changes made',
      });
    });
  });

  describe('DELETE /api/users', () => {
    it('should return 401 if admin password is incorrect', async () => {
      const mockCookies = {
        get: vi.fn().mockReturnValue('valid-token'),
      };

      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          userId: '12345',
          current_password: 'wrongpassword',
        }),
      };

      global.fetch
        .mockResolvedValueOnce({ ok: true }) // Token verification
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
          json: vi.fn().mockResolvedValue({}),
        }); // Incorrect password

      const response = await DELETE({
        request: mockRequest as any,
        cookies: mockCookies as any,
      });

      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(response.status).toBe(401);
      const responseBody = await response.json();
      expect(responseBody).toEqual({
        error: 'Unauthorized',
        details: 'Unauthorized',
      });
    });

    it('should return error if deletion fails with unexpected status', async () => {
      const mockCookies = {
        get: vi.fn().mockReturnValue('valid-token'),
      };

      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          userId: '12345',
          current_password: 'password123',
        }),
      };

      global.fetch
        .mockResolvedValueOnce({ ok: true }) // Token verification
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: vi.fn().mockResolvedValue({}),
        }); // Deletion fails

      const response = await DELETE({
        request: mockRequest as any,
        cookies: mockCookies as any,
      });

      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(response.status).toBe(500);
      const responseBody = await response.json();
      expect(responseBody).toEqual({
        error: "Errore durante l'eliminazione dell'utente",
        details: expect.anything(),
      });
    });
  });
});
