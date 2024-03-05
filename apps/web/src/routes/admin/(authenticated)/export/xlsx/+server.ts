import type { RequestHandler } from './$types';

import { router } from '@testy/trpc/server/router';
import { createContext } from '@testy/trpc/server/createContext';

export const GET: RequestHandler = async (event) => {
    try {
        const trpc = router.createCaller(await createContext(event));

        await trpc.auth.admin();

        const xlsx = await trpc.users.xlsx();
        return new Response(xlsx, {
            status: 200,
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                // TODO: Můžeme doplnit čas atd.
                'Content-Disposition': `attachment; filename="vysledky.xlsx"`
            }
        });
    } catch {
        return new Response('Čus 👀', { status: 403 });
    }
};
