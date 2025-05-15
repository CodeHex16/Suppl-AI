import { describe, it, expect, vi } from 'vitest';
import { load } from '../../../../src/routes/admin/statistiche/+page.server';
import { logger } from '$lib/utils/logger';

vi.mock('$lib/utils/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

describe('load function', () => {
  it('should log info when loading the page', async () => {
    const fetch = vi.fn();
    const cookies = {
      get: vi.fn(() => 'valid-token'),
    };
    const url = new URL('http://localhost');

    await load({ fetch, cookies, url });

    expect(logger.info).toHaveBeenCalledWith('Loading admin statistics page');
  });


  it('should not throw an error if token is present', async () => {
    const fetch = vi.fn();
    const cookies = {
      get: vi.fn(() => 'valid-token'),
    };
    const url = new URL('http://localhost');

    await expect(load({ fetch, cookies, url })).resolves.not.toThrow();
  });
});