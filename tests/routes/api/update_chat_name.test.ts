import { vi, test, expect, beforeEach } from 'vitest';
import { POST } from '../../../src/routes/api/update_chat_name/+server';
import { json } from '@sveltejs/kit';
vi.mock('@sveltejs/kit', () => ({
  json: (data)=>data,
}));
vi.mock('$env/dynamic/public', () => ({
  env: {
    PUBLIC_DATABASE_URL: 'mock-database-url',
    PUBLIC_LLM_URL: 'mock-llm-url'
  }
}));

// Mock the fetch function to simulate external requests
globalThis.fetch = vi.fn();

// Mock cookies.get to return a fake token
vi.mock('$cookies', () => ({
  get: vi.fn().mockReturnValue('mock-token')
}));

beforeEach(() => {
  vi.clearAllMocks(); // Clear mocks before each test
});

test('POST request successfully fetches a title and updates the chat name', async () => {
  const mockRequestData = {
    chat_id: 'chat123',
    messages: [
      { sender: 'user', content: 'Hello' },
      { sender: 'bot', content: 'Hi there!' }
    ]
  };

  // Mock the LLM API response
  const mockLLMResponse = {
    json: vi.fn().mockResolvedValue({ title: 'Mock Title' }),
    ok: true,
  };
  (globalThis.fetch as any).mockResolvedValueOnce(mockLLMResponse);

  // Mock the DATABASE API response (simulating a successful update)
  const mockDatabaseResponse = {
    ok: true
  };
  (globalThis.fetch as any).mockResolvedValueOnce(mockDatabaseResponse);

  const request = {
    json: vi.fn().mockResolvedValue(mockRequestData),

    // Add any other necessary methods like `headers` if needed
  };

  const cookies = {
    get: vi.fn().mockReturnValue('mock-token') // Returning a mock token
  };

  const response = await POST({ request, cookies });

  // Assert that the response is as expected
  
  expect(response).toEqual({
    title: { title: 'Mock Title' }  
  });
});
