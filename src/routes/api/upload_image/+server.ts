import type { RequestHandler } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';

export const POST: RequestHandler = async ({ request }) => {
	const formData = await request.formData();

	const name = formData.get('name')?.toString(); // 👈 preso dal corpo della richiesta
	const file = formData.get('file') as File;

	if (!name || !/^[a-zA-Z0-9_\-\.]+$/.test(name)) {
		return new Response('Nome file non valido', { status: 400 });
	}

	if (!file || !file.name) {
		return new Response('File mancante', { status: 400 });
	}

	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);

	const filePath = path.resolve('static/img', name);
	await fs.writeFile(filePath, buffer);

	return new Response(`File ${name} salvato`, { status: 200 });
};
