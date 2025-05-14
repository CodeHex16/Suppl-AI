// Messages.test.ts
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import Messages from '$lib/components/Messages.svelte';
import {type Message} from '$lib/types';
const sampleData: Message[] = [
  { sender: 'user', content: 'Hello', isLoading: false,
    timestamp:"", id:"1", authorId:"1", rating: null, _id:"1" },
  { sender: 'bot', content: 'Hi there!', isLoading: false,
    timestamp:"", id:"2", authorId:"2", rating: null, _id:"2" },  
  { sender: 'user', content: 'How are you?', isLoading: true,
    timestamp:"", id:"3", authorId:"1", rating: null, _id:"3" },
];

describe('Messages', () => {
	it('renders UserMessage and BotMessage components', () => {
		const { getByText } = render(Messages, {
			props: {
				data: sampleData
			}
		});

		expect(getByText('Hello')).toBeTruthy();
		expect(getByText('Hi there!')).toBeTruthy();
	});

	it('handles loading bot messages', () => {
		const { container } = render(Messages, {
			props: { data: sampleData }
		});

		const botMessages = container.querySelectorAll('div'); // 视具体结构
		expect(botMessages.length).toBeGreaterThanOrEqual(1);
	});
});
