import { createContext } from 'trpc/context';
import { router } from 'trpc/router';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => ({
    groups: router
        .createCaller(await createContext(event))
        .groups.list(event.url.searchParams.get('q') || undefined)
});
