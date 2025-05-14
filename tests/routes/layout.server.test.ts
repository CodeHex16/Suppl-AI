import { load } from '../../src/routes/+layout.server';
import { vi } from 'vitest';
import fs from 'fs/promises';

describe('load function', () => {
  beforeAll(() => {
    vi.mock('@sveltejs/kit', () => ({
      fail: vi.fn(),
      redirect: vi.fn(),
    }));
  });

  it('should return colors and theme from file', async () => {
    const otherCookies= {
      get: vi.fn().mockReturnValue(undefined),
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const result = await load({ cookies: otherCookies });
    expect(result?.colors.COLOR_PRIMARY).toEqual("#00458b");
    expect(result?.theme).toEqual('light');
  });

  it('should return colors and theme from cookies', async () => {
    const otherCookies = {
      get: vi.fn().mockReturnValue('dark'),
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const result = await load({ cookies: otherCookies });
    expect(result?.colors.COLOR_PRIMARY).toEqual("#00458b");
    expect(result?.theme).toEqual('dark');
  });

  it('should return default colors and theme if file read fails', async () => {
    const otherCookies = {
      get: vi.fn().mockReturnValue(undefined),
    };
    vi.spyOn(fs, 'readFile').mockRejectedValue(new Error('File not found'));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const result = await load({ cookies: otherCookies });
    expect(result?.colors.COLOR_PRIMARY).toEqual("#0dab44");
    expect(result?.theme).toEqual('light');
  });

});
