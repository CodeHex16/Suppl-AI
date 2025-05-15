import { error, json, type RequestHandler } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';
import { logger } from '$lib/utils/logger';

const UPLOAD_DIR = path.resolve('static/img');

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/avif', 'image/svg+xml', 'image/x-icon'];
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const POST: RequestHandler = async ({ request }) => {
    logger.info('POST /api/upload_image');
    let requestedName: string | undefined;
    let file: File | null = null;

    try {
        const formData = await request.formData();
        const nameValue = formData.get('name');
        const fileValue = formData.get('file');
        logger.debug('Form data:', formData);

        if (typeof nameValue !== 'string' || !nameValue) {
            logger.error('Nome file mancante o non valido nel form data.');
            throw error(400, 'Nome file mancante o non valido nel form data.');
        }
        requestedName = nameValue;

        if (!(fileValue instanceof File)) {
            logger.error('File mancante o non valido nel form data.');
            throw error(400, 'File mancante o non valido nel form data.');
        }
        file = fileValue;

        const sanitizedName = path.basename(requestedName);
        if (sanitizedName !== requestedName || !/^[a-zA-Z0-9_\-\.]+$/.test(sanitizedName)) {
            logger.error(`Nome file "${requestedName}" non valido. Contiene caratteri non permessi o tentativi di path traversal.`);
            throw error(400, `Nome file "${requestedName}" non valido. Contiene caratteri non permessi o tentativi di path traversal.`);
        }

        // Opzionale: Validazione tipo MIME e dimensione
        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
            logger.error(`Tipo file non consentito: ${file.type}`);
            throw error(400, `Tipo file non consentito: ${file.type}`);
        }
        if (file.size > MAX_FILE_SIZE_BYTES) {
            logger.error(`File troppo grande: ${Math.round(file.size / 1024 / 1024 * 100) / 100}MB (max ${MAX_FILE_SIZE_MB}MB)`);
            throw error(400, `File troppo grande: ${Math.round(file.size / 1024 / 1024 * 100) / 100}MB (max ${MAX_FILE_SIZE_MB}MB)`);
        }
        

        // Assicura che la directory di upload esista
        try {
            await fs.access(UPLOAD_DIR);
            logger.log(`Directory di upload esistente: ${UPLOAD_DIR}`);
        } catch (e) {
            // Se non esiste, prova a crearla
            logger.log(`Directory di upload non trovata, creazione in corso: ${UPLOAD_DIR}`);
            await fs.mkdir(UPLOAD_DIR, { recursive: true });
        }

        // Leggi il file e scrivilo
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const filePath = path.join(UPLOAD_DIR, sanitizedName); 

        await fs.writeFile(filePath, buffer);

        logger.log(`File salvato con successo: ${filePath}`);
        return json({ message: `File ${sanitizedName} salvato con successo.` }, { status: 200 });

    } catch (err: any) {
        logger.error('Errore durante l\'upload del file:', err);

        if (err.status && err.body) {
            throw err;
        }

        throw error(500, `Errore interno del server durante il salvataggio del file ${requestedName || ''}. Dettagli: ${err.message || 'Errore sconosciuto'}`);
    }
};