import { describe, it, expect } from 'vitest';
import { POST } from '../../../src/routes/api/update_colors/+server';
import fs from 'fs/promises';
import path from 'path';

vi.mock('fs/promises');

describe('POST /api/colors', () => {
  const mockRequest = (body: Record<string, string>) => ({
    json: async () => body,
  });

  beforeEach(() => {
    fs.writeFile = vi.fn().mockResolvedValue(true);
  });
  const filePath = path.resolve('static/settings/colors.json');

  it('should save colors to a file and return success response', async () => {
    const request = mockRequest({
      COLOR_PRIMARY: '#FFFFFF',
      COLOR_PRIMARY_HOVER: '#F0F0F0',
      COLOR_PRIMARY_TEXT: '#000000',
    });

    const response = await POST({ request } as any);

    expect(fs.writeFile).toHaveBeenCalledWith(
      filePath,
      JSON.stringify(
        {
          COLOR_PRIMARY: '#FFFFFF',
          COLOR_PRIMARY_HOVER: '#F0F0F0',
          COLOR_PRIMARY_TEXT: '#000000',
        },
        null,
        2
      ),
      'utf-8'
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true });
  });

  it('should return an error response if saving fails', async () => {
    vi.mocked(fs.writeFile).mockRejectedValueOnce(new Error('File write error'));

    const request = mockRequest({
      COLOR_PRIMARY: '#FFFFFF',
      COLOR_PRIMARY_HOVER: '#F0F0F0',
      COLOR_PRIMARY_TEXT: '#000000',
    });

    const response = await POST({ request } as any);

    expect(fs.writeFile).toHaveBeenCalled();
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Errore nel salvataggio' });
  });

  it('should return an error response if request body is invalid', async () => {
    const request = {
      json: async () => {
        throw new Error('Invalid JSON');
      },
    };

    const response = await POST({ request } as any);

    expect(fs.writeFile).not.toHaveBeenCalled();
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Errore nel salvataggio' });
  });
});