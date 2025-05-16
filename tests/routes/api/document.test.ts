import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST, DELETE } from '../../../src/routes/api/documents/+server';
import { json } from '@sveltejs/kit';

vi.mock('@sveltejs/kit', () => ({
  json: vi.fn(),
}));

describe('POST Handler - Additional Tests', () => {
  let fetchMock: any;
  let cookiesMock: any;

  beforeEach(() => {
    fetchMock = vi.fn();
    cookiesMock = {
      get: vi.fn(),
      delete: vi.fn(),
    };
  });

  it('should return 401 if no token is provided', async () => {
    cookiesMock.get.mockReturnValue(undefined);

    const request = { formData: vi.fn().mockResolvedValue(new FormData()) };

    const result = await POST({ request, cookies: cookiesMock, fetch: fetchMock });

    expect(result).toEqual(json({ error: 'Unauthorized' }, { status: 401 }));
  });

  it('should return 500 if LLM service fails unexpectedly', async () => {
    cookiesMock.get.mockReturnValue('valid-token');
    fetchMock.mockResolvedValueOnce({ ok: true }); // Token is valid
    fetchMock.mockRejectedValueOnce(new Error('Unexpected LLM error'));

    const formData = new FormData();
    const file = new File(['file content'], 'file.txt', { type: 'text/plain' });
    formData.append('files', file);

    const request = { formData: vi.fn().mockResolvedValue(formData) };

    const result = await POST({ request, cookies: cookiesMock, fetch: fetchMock });

    expect(result).toEqual(json({ error: 'Internal server error' }, { status: 500 }));
  });

  it('should return 400 if no files are provided in FormData', async () => {
    cookiesMock.get.mockReturnValue('valid-token');
    fetchMock.mockResolvedValueOnce({ ok: true }); // Token is valid

    const formData = new FormData(); // No files added
    const request = { formData: vi.fn().mockResolvedValue(formData) };

    const result = await POST({ request, cookies: cookiesMock, fetch: fetchMock });

    expect(result).toEqual(json({ error: "Nessun file valido inviato con chiave 'files'" }, { status: 400 }));
  });
});

describe('DELETE Handler - Additional Tests', () => {
  let fetchMock: any;
  let cookiesMock: any;

  beforeEach(() => {
    fetchMock = vi.fn();
    cookiesMock = {
      get: vi.fn(),
    };
  });

  it('should return 401 if no token is provided', async () => {
    cookiesMock.get.mockReturnValue(undefined);

    const request = { json: vi.fn().mockResolvedValue({ id: 'file-id', title: 'file-title', current_password: 'password' }) };

    const result = await DELETE({ request, cookies: cookiesMock, fetch: fetchMock });

    expect(result).toEqual(json({ error: 'Unauthorized' }, { status: 401 }));
  });

  it('should return 500 if the LLM service throws an unexpected error', async () => {
    cookiesMock.get.mockReturnValue('valid-token');
    fetchMock.mockResolvedValueOnce({ ok: true }); // Token is valid
    fetchMock.mockRejectedValueOnce(new Error('Unexpected LLM error'));

    const request = { json: vi.fn().mockResolvedValue({ id: 'file-id', title: 'file-title', current_password: 'password' }) };

    const result = await DELETE({ request, cookies: cookiesMock, fetch: fetchMock });

    expect(result).toEqual(json({ error: 'Internal server error' }, { status: 500 }));
  });

  it('should return 400 if the request body is completely empty', async () => {
    cookiesMock.get.mockReturnValue('valid-token');
    fetchMock.mockResolvedValueOnce({ ok: true }); // Token is valid

    const request = { json: vi.fn().mockResolvedValue(null) }; // Empty body

    const result = await DELETE({ request, cookies: cookiesMock, fetch: fetchMock });

    expect(result).toEqual(json({ error: "Errore durante l'eliminazione dell'utente", details: expect.any(Object) }, { status: 400 }));
  });
describe('POST Handler - Additional Branch Tests', () => {
  let fetchMock: any;
  let cookiesMock: any;

  beforeEach(() => {
    fetchMock = vi.fn();
    cookiesMock = {
      get: vi.fn(),
      delete: vi.fn(),
    };
  });

  it('should return 400 if token verification fails with specific error', async () => {
    cookiesMock.get.mockReturnValue('invalid-token');
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: vi.fn().mockResolvedValue({ error: 'Invalid token' }),
    });

    const formData = new FormData();
    const request = { formData: vi.fn().mockResolvedValue(formData) };

    const result = await POST({ request, cookies: cookiesMock, fetch: fetchMock });

    expect(cookiesMock.delete).toHaveBeenCalledWith('token', { path: '/' });
    expect(result).toEqual(
      json({ error: 'Token non valido', details: { error: 'Invalid token' } }, { status: 400 })
    );
  });

  it('should return 400 if LLM service responds with "File già caricato!"', async () => {
    cookiesMock.get.mockReturnValue('valid-token');
    fetchMock.mockResolvedValueOnce({ ok: true }); // Token is valid
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: vi.fn().mockResolvedValue({ error: 'File già caricato!' }),
    });

    const formData = new FormData();
    const file = new File(['file content'], 'file.txt', { type: 'text/plain' });
    formData.append('files', file);

    const request = { formData: vi.fn().mockResolvedValue(formData) };

    const result = await POST({ request, cookies: cookiesMock, fetch: fetchMock });

    expect(result).toEqual(json({ error: 'File già caricato!' }, { status: 400 }));
  });

  it('should return 500 if LLM service response is malformed', async () => {
    cookiesMock.get.mockReturnValue('valid-token');
    fetchMock.mockResolvedValueOnce({ ok: true }); // Token is valid
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: vi.fn().mockRejectedValue(new Error('Malformed response')),
    });

    const formData = new FormData();
    const file = new File(['file content'], 'file.txt', { type: 'text/plain' });
    formData.append('files', file);

    const request = { formData: vi.fn().mockResolvedValue(formData) };

    const result = await POST({ request, cookies: cookiesMock, fetch: fetchMock });

    expect(result).toEqual(json({ error: 'Internal server error' }, { status: 500 }));
  });
});

describe('DELETE Handler - Additional Branch Tests', () => {
  let fetchMock: any;
  let cookiesMock: any;

  beforeEach(() => {
    fetchMock = vi.fn();
    cookiesMock = {
      get: vi.fn(),
    };
  });

  it('should return 401 if token verification fails', async () => {
    cookiesMock.get.mockReturnValue('invalid-token');
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: vi.fn().mockResolvedValue({ error: 'Invalid token' }),
    });

    const request = { json: vi.fn().mockResolvedValue({ id: 'file-id', title: 'file-title', current_password: 'password' }) };

    const result = await DELETE({ request, cookies: cookiesMock, fetch: fetchMock });

    expect(result).toEqual(
      json({ error: 'Token non valido', details: { error: 'Invalid token' } }, { status: 401 })
    );
  });



  it('should return 400 if DELETE request body is missing required fields', async () => {
    cookiesMock.get.mockReturnValue('valid-token');
    fetchMock.mockResolvedValueOnce({ ok: true }); // Token is valid

    const request = { json: vi.fn().mockResolvedValue({}) }; // Missing fields

    const result = await DELETE({ request, cookies: cookiesMock, fetch: fetchMock });

    expect(result).toEqual(
      json({ error: "Errore durante l'eliminazione dell'utente", details: expect.any(Object) }, { status: 400 })
    );
  });
})








describe('POST Handler - Uncovered Tests', () => {
  let fetchMock: any;
  let cookiesMock: any;

  beforeEach(() => {
    fetchMock = vi.fn();
    globalThis.fetch = fetchMock;
    cookiesMock = {
      get: vi.fn(),
      delete: vi.fn(),
    };
  });

  it('should handle token verification failure with non-400 status', async () => {
    cookiesMock.get.mockReturnValue('invalid-token');
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 403,
      json: vi.fn().mockResolvedValue({ error: 'Forbidden' }),
    });

    const formData = new FormData();
    const request = { formData: vi.fn().mockResolvedValue(formData) };

    const result = await POST({ request, cookies: cookiesMock, fetch: fetchMock });

    expect(cookiesMock.delete).toHaveBeenCalledWith('token', { path: '/' });
    expect(result).toEqual(
      json({ error: 'Token non valido', details: { error: 'Forbidden' } }, { status: 403 })
    );
  });

  it('should handle LLM service returning 400 with specific error', async () => {
    cookiesMock.get.mockReturnValue('valid-token');
    fetchMock.mockResolvedValueOnce({ ok: true }); // Token is valid
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: vi.fn().mockResolvedValue({ error: 'File già caricato o formato errato!' }),
    });

    const formData = new FormData();
    const file = new File(['file content'], 'file.txt', { type: 'text/plain' });
    formData.append('files', file);

    const request = { formData: vi.fn().mockResolvedValue(formData) };

    const result = await POST({ request, cookies: cookiesMock, fetch: fetchMock });

    expect(result).toEqual(json({ error: 'File già caricato o formato errato!' }, { status: 400 }));
  });

  it('should handle LLM service returning non-400 error', async () => {
    cookiesMock.get.mockReturnValue('valid-token');
    fetchMock.mockResolvedValueOnce({ ok: true }); // Token is valid
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: vi.fn().mockResolvedValue({ error: 'Unexpected server error' }),
    });

    const formData = new FormData();
    const file = new File(['file content'], 'file.txt', { type: 'text/plain' });
    formData.append('files', file);

    const request = { formData: vi.fn().mockResolvedValue(formData) };

    const result = await POST({ request, cookies: cookiesMock, fetch: fetchMock });

    expect(result).toEqual(
      json({ error: "Errore durante l'aggiunta del documento", details: expect.any(Object) }, { status: 500 })
    );
  });
});

describe('DELETE Handler - Uncovered Tests', () => {
  let fetchMock: any;
  let cookiesMock: any;

  beforeEach(() => {
    fetchMock = vi.fn();
    cookiesMock = {
      get: vi.fn(),
    };
  });

  it('should handle DELETE request with invalid token and non-401 status', async () => {
    cookiesMock.get.mockReturnValue('invalid-token');
    globalThis.fetch = fetchMock;
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 403,
      json: vi.fn().mockResolvedValue({ error: 'Forbidden' }),
    });

    const request = { json: vi.fn().mockResolvedValue({ id: 'file-id', title: 'file-title', current_password: 'password' }) };

    const result = await DELETE({ request, cookies: cookiesMock, fetch: fetchMock });

    expect(result).toEqual(
      json({ error: 'Token non valido', details: { error: 'Forbidden' } }, { status: 403 })
    );
  });

  it('should handle DELETE request with missing fields in request body', async () => {
    cookiesMock.get.mockReturnValue('valid-token');
    globalThis.fetch = fetchMock;
    fetchMock.mockResolvedValueOnce({ ok: true }); // Token is valid

    const request = { json: vi.fn().mockResolvedValue({ id: 'file-id' }) }; // Missing title and current_password

    const result = await DELETE({ request, cookies: cookiesMock, fetch: fetchMock });

    expect(result).toEqual(
      json({ error: "Errore durante l'eliminazione dell'utente", details: expect.any(Object) }, { status: 400 })
    );
  });

  it('should handle DELETE request with LLM service returning non-401 error', async () => {
    cookiesMock.get.mockReturnValue('valid-token');
    globalThis.fetch = fetchMock;
    fetchMock.mockResolvedValueOnce({ ok: true }); // Token is valid
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: vi.fn().mockResolvedValue({ error: 'Unexpected server error' }),
    });

    const request = { json: vi.fn().mockResolvedValue({ id: 'file-id', title: 'file-title', current_password: 'password' }) };

    const result = await DELETE({ request, cookies: cookiesMock, fetch: fetchMock });

    expect(result).toEqual(
      json({ error: "Errore durante l'eliminazione dell'utente", details: expect.any(Object) }, { status: 500 })
    );
  });
});



});