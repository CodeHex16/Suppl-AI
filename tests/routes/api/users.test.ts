import { POST, PUT, DELETE } from '../../../src/routes/api/users/+server';
import { describe, it, expect, vi } from 'vitest';

global.fetch = vi.fn();


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
          scope: 'admin',
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
        user: { name: 'John Doe', email: 'john.doe@example.com', role: 'admin' },
        message: 'User added successfully',
      });
    });

    it('should return 401 if token is missing', async () => {
      const mockCookies = {
        get: vi.fn().mockReturnValue(null),
      };

      const mockRequest = {
        json: vi.fn(),
      };

      const response = await POST({
        request: mockRequest as any,
        cookies: mockCookies as any,
      });

      expect(response.status).toBe(401);
      const responseBody = await response.json();
      expect(responseBody).toEqual({ error: 'Unauthorized' });
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
      expect(response.status).toBe(401);
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
          email: 'jane.doe@example.com',
          scope: 'editor',
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
      expect(responseBody).toEqual({
        success: true,
        user: { name: 'Jane Doe', email: 'jane.doe@example.com', role: 'editor' },
        message: 'User updated successfully',
      });
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