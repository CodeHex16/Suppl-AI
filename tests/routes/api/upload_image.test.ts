import { describe, it, expect, vi } from 'vitest';
import { POST } from '../../../src/routes/api/upload_image/+server';
import fs from 'fs/promises';
import path from 'path';

vi.mock('fs/promises');
fs.writeFile = vi.fn().mockResolvedValue(true);
fs.access = vi.fn().mockResolvedValue(true);
fs.mkdir = vi.fn().mockResolvedValue(true);

vi.mock('@sveltejs/kit', ()=> ({
  error: vi.fn((status, message) => ({
    status,
    message,
  })),
  json: vi.fn((data, { status }) => ({
    status,
    body: data,
  })),
}));


const UPLOAD_DIR = path.resolve('static/img');

describe('POST /api/upload_image', () => {
  it('should save a valid file successfully', async () => {
    const mockFile = new File(['dummy content'], 'test.png', { type: 'image/png' });
    mockFile.arrayBuffer = vi.fn().mockResolvedValue(new ArrayBuffer(10)); // Mock arrayBuffer method
    const mockFormData = new FormData();
    mockFormData.append('name', 'test.png');
    mockFormData.append('file', mockFile);

    const mockRequest = {
      formData: vi.fn().mockResolvedValue(mockFormData),
    };

    const response = await POST({ request: mockRequest as any });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'File test.png salvato con successo.' });
    expect(fs.access).toHaveBeenCalledWith(UPLOAD_DIR);
    expect(fs.mkdir).not.toHaveBeenCalled(); // Directory already exists
    expect(fs.writeFile).toHaveBeenCalledWith(
      path.join(UPLOAD_DIR, 'test.png'),
      expect.any(Buffer)
    );
  });

  it('should return 400 if name is missing', async () => {
    const mockFile = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const mockFormData = new FormData();
    mockFormData.append('file', mockFile);

    const mockRequest = {
      formData: vi.fn().mockResolvedValue(mockFormData),
    };

    await expect(POST({ request: mockRequest as any })).rejects.toThrowError(
      'Nome file mancante o non valido nel form data.'
    );
  });

  it('should return 400 if file is missing', async () => {
    const mockFormData = new FormData();
    mockFormData.append('name', 'test.png');

    const mockRequest = {
      formData: vi.fn().mockResolvedValue(mockFormData),
    };

    await expect(POST({ request: mockRequest as any })).rejects.toThrowError(
      'File mancante o non valido nel form data.'
    );
  });

  it('should return 400 for invalid MIME type', async () => {
    const mockFile = new File(['dummy content'], 'test.txt', { type: 'text/plain' });
    const mockFormData = new FormData();
    mockFormData.append('name', 'test.txt');
    mockFormData.append('file', mockFile);

    const mockRequest = {
      formData: vi.fn().mockResolvedValue(mockFormData),
    };

    await expect(POST({ request: mockRequest as any })).rejects.toThrowError(
      'Tipo file non consentito: text/plain'
    );
  });

  it('should return 400 for file exceeding size limit', async () => {
    const largeContent = new Uint8Array(6 * 1024 * 1024); // 6MB
    const mockFile = new File([largeContent], 'large.png', { type: 'image/png' });
    const mockFormData = new FormData();
    mockFormData.append('name', 'large.png');
    mockFormData.append('file', mockFile);

    const mockRequest = {
      formData: vi.fn().mockResolvedValue(mockFormData),
    };

    await expect(POST({ request: mockRequest as any })).rejects.toThrowError(
      /File troppo grande/
    );
  });

  it('should create the upload directory if it does not exist', async () => {
    vi.mocked(fs.access).mockRejectedValueOnce(new Error('Directory does not exist'));

    const mockFile = new File(['dummy content'], 'test.png', { type: 'image/png' });
    mockFile.arrayBuffer = vi.fn().mockResolvedValue(new ArrayBuffer(10)); // Mock arrayBuffer method
    const mockFormData = new FormData();
    mockFormData.append('name', 'test.png');
    mockFormData.append('file', mockFile);

    const mockRequest = {
      formData: vi.fn().mockResolvedValue(mockFormData),
    };

    const response = await POST({ request: mockRequest as any });

    expect(response.status).toBe(200);
    expect(fs.mkdir).toHaveBeenCalledWith(UPLOAD_DIR, { recursive: true });
  });
});