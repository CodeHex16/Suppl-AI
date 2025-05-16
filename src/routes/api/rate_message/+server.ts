import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';
import { logger } from '$lib/utils/logger';

const DATABASE_URL = env.PUBLIC_DATABASE_URL;

export const POST: RequestHandler = async ({ request, cookies }) => {
    logger.info('POST /api/rate_message');
    try {
        const req = await request.json();
        const token = cookies.get('token');
        logger.debug('req', req);
        if (!token) {
            logger.error('Token non trovato');
            return json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Aggiorna la valutazione del messaggio del bot nel database
        logger.log('making request to', `http://${DATABASE_URL}/chats/${req.chat_id}/messages/${req.message_id}/rating`);
        const response = await fetch(`http://${DATABASE_URL}/chats/${req.chat_id}/messages/${req.message_id}/rating`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                rating: req.rating
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            logger.error('Errore durante l\'aggiornamento del rating', errorData);
            return json(
                { error: 'Failed to update rating', details: errorData },
                { status: response.status }
            );
        }
        logger.info('Rating aggiornato con successo', req.rating);
        return json({ success: true });
    } catch (error) {
        logger.error('Errore durante l\'aggiornamento del rating:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
};
