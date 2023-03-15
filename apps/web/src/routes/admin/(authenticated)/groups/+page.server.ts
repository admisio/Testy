import { createContext } from '@testy/trpc/server/createContext';
import { router } from '@testy/trpc/server/router';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => ({
    groups: router
        .createCaller(await createContext(event))
        .groups.list(event.url.searchParams.get('q') || undefined)
});
