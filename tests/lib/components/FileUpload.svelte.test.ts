import { render, fireEvent, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import FileUpload from '$lib/components/FileUpload.svelte';

describe('FileUpload component', () => {
	it('renders label and default name', () => {
		render(FileUpload, {
			props: {
				label: 'Logo della WebApp',
				contextLabel: 'Light Mode',
			},
		});

		expect(screen.getByText('Logo della WebApp')).toBeInTheDocument();
		expect(screen.getByText('(Light Mode)')).toBeInTheDocument();
		expect(screen.getByText('Nessun file selezionato')).toBeInTheDocument();
	});

	it('updates name when file is selected', async () => {
		render(FileUpload, {
			props: {
				label: 'Upload file test',
			},
		});

		const file = new File(['dummy content'], 'logo.png', { type: 'image/png' });
		const input = screen.getByLabelText('Upload file test') as HTMLInputElement;

		await fireEvent.change(input, {
			target: { files: [file] },
		});

		expect(screen.getByText('logo.png')).toBeInTheDocument();
	});

	it('resets name if no file selected', async () => {
		render(FileUpload, {
			props: {
				label: 'Upload file test',
			},
		});

		const input = screen.getByLabelText('Upload file test') as HTMLInputElement;

		await fireEvent.change(input, {
			target: { files: [] },
		});

		expect(screen.getByText('Nessun file selezionato')).toBeInTheDocument();
	});
});
