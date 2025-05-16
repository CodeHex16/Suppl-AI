import { describe, it, expect, vi } from 'vitest';
import { POST, GET } from '../../../src/routes/api/update_settings/+server';
import { logger } from '../../../src/lib/utils/logger';

vi.mock('../../../src/lib/utils/logger', () => ({
  logger: {
    info: vi.fn(),
    debug: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('$env/dynamic/public', () => ({
  env: {
    PUBLIC_DATABASE_URL: 'mock-database-url',
  },
}));

describe('API /api/update_settings', () => {
  describe('POST', () => {
    it('should update settings successfully', async () => {
      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          color_primary: '#ffffff',
          color_primary_hover: '#cccccc',
          color_primary_text: '#000000',
          chat_history: true,
        }),
      };

      const mockCookies = {
        get: vi.fn().mockReturnValue('mock-token'),
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn(),
      });

      const response = await POST({ request: mockRequest, cookies: mockCookies } as any);

      expect(response).toEqual({ ok: true, message: 'Settings updated successfully' });
      expect(logger.info).toHaveBeenCalledWith('POST /api/update_settings');
      expect(logger.info).toHaveBeenCalledWith('Settings updated successfully');
    });

    it('should handle errors when updating settings', async () => {
      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          color_primary: '#ffffff',
          color_primary_hover: '#cccccc',
          color_primary_text: '#000000',
          chat_history: true,
        }),
      };

      const mockCookies = {
        get: vi.fn().mockReturnValue('mock-token'),
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        statusText: 'Internal Server Error',
        json: vi.fn().mockResolvedValue({ error: 'Database error' }),
      });

      const response = await POST({ request: mockRequest, cookies: mockCookies } as any);

      expect(response.status).toBe(500);
      expect(logger.error).toHaveBeenCalledWith('Error from database:', { error: 'Database error' });
    });
  });

  describe('GET', () => {
    it('should fetch settings successfully', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({
          color_primary: '#ffffff',
          color_primary_hover: '#cccccc',
          color_primary_text: '#000000',
          message_history: true,
        }),
      });

      const response = await GET({} as any);

      expect(response.status).toBe(200);
      const responseBody = await response.json();
      expect(responseBody).toEqual({
        color_primary: '#ffffff',
        color_primary_hover: '#cccccc',
        color_primary_text: '#000000',
        message_history: true,
      });
      expect(logger.info).toHaveBeenCalledWith('GET /api/get_settings');
      expect(logger.info).toHaveBeenCalledWith('Settings fetched successfully', JSON.stringify(responseBody));
    });

    it('should handle errors when fetching settings', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: vi.fn().mockResolvedValue({ error: 'Database error' }),
      });

      const response = await GET({} as any);

      expect(response.status).toBe(500);
      const responseBody = await response.json();
      expect(responseBody).toEqual(expect.objectContaining({ error: expect.any(String) }))
    });
  });
});