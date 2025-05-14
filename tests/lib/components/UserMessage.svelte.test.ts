import { render } from '@testing-library/svelte';
import UserMessage from '$lib/components/UserMessage.svelte';
import { vi } from 'vitest';
import * as dateUtils from '$lib/utils/date';

import { type Message } from '$lib/types';

describe('UserMessage component', () => {
	const sampleMessage:Message = {
		content: 'Ciao, come va?',
		timestamp: '2025-05-13T10:30:00Z',
		sender: 'user',
    id: '12345',
    authorId: '67890',
    isLoading: false,
    rating: false,
	};

	it('renders the message content', () => {
		const { getByText } = render(UserMessage, {
			props: { data: sampleMessage }
		});

		expect(getByText('Ciao, come va?')).toBeTruthy();
	});

	it('formats and displays the timestamp when provided', () => {
		// mock formatData
		const formatMock = vi.spyOn(dateUtils, 'formatData').mockReturnValue('13 Maggio 2025');

		const { getByText } = render(UserMessage, {
			props: { data: sampleMessage }
		});

		expect(formatMock).toHaveBeenCalledWith('2025-05-13T10:30:00Z');
		expect(getByText('13 Maggio 2025')).toBeTruthy();

		formatMock.mockRestore();
	});

	it('shows "Adesso" if no timestamp is provided', () => {
		const { getByText } = render(UserMessage, {
			props: {
				data: {
          ...sampleMessage,
          timestamp: ''
        }
			}
		});

		expect(getByText('Adesso')).toBeTruthy();
	});
});
