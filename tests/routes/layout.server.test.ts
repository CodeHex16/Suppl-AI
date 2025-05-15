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



});
