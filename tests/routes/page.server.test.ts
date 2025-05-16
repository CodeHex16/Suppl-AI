import { vi ,type Mock} from 'vitest';
import { redirect } from '@sveltejs/kit';

vi.mock('$env/dynamic/public', () => ({
  env: {
    PUBLIC_API_BASE_URL: 'http://mock-api'
  }
}));
vi.mock('@sveltejs/kit', () => ({
  redirect: vi.fn((status, location) => {
    throw { status, location };
  }),
  error: vi.fn(),
  invalid: vi.fn()
}));

import { load, actions } from '../../src/routes/+page.server'; // Adjust the import to the correct path

vi.stubGlobal('fetch', vi.fn());

describe('page.server.ts', () => {
  describe('load function', () => {
    it('should redirect to /login when no token is found', async () => {
      const mockCookies = {
        get: vi.fn().mockReturnValue(null),
        delete: vi.fn(),
      };

      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await load({ cookies: mockCookies });
      } catch (error) {
        expect(error).toEqual({ status: 303, location: '/login' });
      }
    });

    it('should redirect to /cambio-password when user is not initialized', async () => {
      const mockCookies = {
        get: vi.fn().mockReturnValue('valid-token'),
        delete: vi.fn(),
      };
      (globalThis.fetch as Mock).mockResolvedValueOnce({
        json: vi.fn().mockResolvedValueOnce({ status: 'not_initialized' }),
      });

      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await load({ cookies: mockCookies });
      } catch (error) {
        expect(error).toEqual({ status: 303, location: '/cambio-password' });
      }
    });

    it('should throw an error when token is invalid', async () => {
      const mockCookies = {
        get: vi.fn().mockReturnValue('invalid-token'),
        delete: vi.fn(),
      };
      (globalThis.fetch as Mock).mockResolvedValueOnce({
        json: vi.fn().mockResolvedValueOnce({ status: 'invalid' }),
      });

      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await load({ cookies: mockCookies });
      } catch (error) {
        expect(mockCookies.delete).toHaveBeenCalledWith('token', { path: '/' });
        expect(error).toEqual({ status: 303, location: '/login' });
      }
    });
  });

  describe('actions', () => {
    it('should toggle the theme to dark', async () => {
      const mockCookies = {
        set: vi.fn(),
        get: vi.fn().mockReturnValue('dark'),
        delete: vi.fn(),
      };
      const mockRequest = {
        formData: vi.fn().mockResolvedValue(new Map([['theme', 'dark']])),
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const result = await actions.toggleTheme({ cookies: mockCookies, request: mockRequest });
      expect(mockCookies.get).toHaveBeenCalled();
      expect(mockRequest.formData).toHaveBeenCalled();
      expect(mockCookies.set).toHaveBeenCalled();
      expect(result).toEqual({ success: true, theme: "dark" });
    });

    it('should toggle the theme to light', async () => {
      const mockCookies = {
        set: vi.fn(),
        get: vi.fn().mockReturnValue('dark'),
        delete: vi.fn(),
      };
      const mockRequest = {
        formData: vi.fn().mockResolvedValue(new Map([['theme', 'light']])),
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const result = await actions.toggleTheme({ cookies: mockCookies, request: mockRequest });
      expect(mockCookies.get).toHaveBeenCalled();
      expect(mockRequest.formData).toHaveBeenCalled();
      expect(mockCookies.set).toHaveBeenCalled();
      expect(result).toEqual({ success: true, theme: "light" });
    });

    it('should toggle the theme', async () => {
      const mockCookies = {
        set: vi.fn(),
        get: vi.fn().mockReturnValue('dark'),
        delete: vi.fn(),
      };
      const mockRequest = {
        formData: vi.fn().mockResolvedValue(new Map([])),
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const result = await actions.toggleTheme({ cookies: mockCookies, request: mockRequest });
      expect(mockCookies.get).toHaveBeenCalled();
      expect(mockRequest.formData).toHaveBeenCalled();
      expect(mockCookies.set).toHaveBeenCalled();
      expect(result).toEqual({ success: true, theme: "light" });
    });

    it('should delete a chat', async () => {
      const mockCookies = {
        get: vi.fn().mockReturnValue('valid-token'),
        delete: vi.fn(),
      };
      const mockRequest = {
        formData: vi.fn().mockResolvedValue(new Map([['chat_id', '123']])),
      };
      (globalThis.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce({ success: true }),
      });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const result = await actions.deleteChat({ cookies: mockCookies, request: mockRequest });
      expect(mockCookies.get).toHaveBeenCalled();
      expect(mockRequest.formData).toHaveBeenCalled();
      expect(result?.success).toBe(true);
    });

    it('should delete a chat with no chat_id', async () => {
      const mockCookies = {
        get: vi.fn().mockReturnValue('valid-token'),
        delete: vi.fn(),
      };
      const mockRequest = {
        formData: vi.fn().mockResolvedValue(new Map([['chat_id', '']])),
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const result = await actions.deleteChat({ cookies: mockCookies, request: mockRequest });
      expect(mockRequest.formData).toHaveBeenCalled();
      expect(result?.success).toBe(false);
    });

    it('should delete a chat with response error', async () => {
      const mockCookies = {
        get: vi.fn().mockReturnValue('valid-token'),
        delete: vi.fn(),
      };
      const mockRequest = {
        formData: vi.fn().mockResolvedValue(new Map([['chat_id', 'chat_123']])),
      };
      (globalThis.fetch as Mock).mockResolvedValueOnce({
        ok: false,
        json: vi.fn().mockResolvedValueOnce({ success: false }),
      });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const result = await actions.deleteChat({ cookies: mockCookies, request: mockRequest });
      expect(mockRequest.formData).toHaveBeenCalled();
      expect(result?.success).toBe(false);//o
    });


  });
});