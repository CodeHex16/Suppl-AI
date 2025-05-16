import { vi } from 'vitest';
import '@testing-library/jest-dom';

vi.mock('$app/environment', () => ({
  browser: true
}));

vi.mock('$env/dynamic/public', () => ({
  env: {
    PUBLIC_DATABASE_URL: 'localhost:3000',
    PUBLIC_LLM_URL: 'localhost:3001',
  }
}));

vi.mock('@sveltejs/kit', async () => {
  const actual = await import('@sveltejs/kit');
  return {
    ...actual,
    fail: vi.fn((status, data) => ({ status, data })),
    redirect: vi.fn((status, location) => ({ status, location }))
  };
});
