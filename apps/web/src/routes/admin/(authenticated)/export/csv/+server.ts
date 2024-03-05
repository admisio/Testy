import type { RequestHandler } from './$types';

import { router } from '@testy/trpc/server/router';
import { createContext } from '@testy/trpc/server/createContext';

export const GET: RequestHandler = async (event) => {
    try {
        const trpc = router.createCaller(await createContext(event));

        await trpc.auth.admin();

        const xlsx = await trpc.users.csv();
        const date = new Date().toISOString().split('.')[0];
        return new Response(xlsx, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="vysledky_${date}.csv"`
            }
        });
    } catch {
        return new Response('Čus 👀', { status: 403 });
    }
};
