import { createContext } from '@testy/trpc/server/createContext';
import { router } from '@testy/trpc/server/router';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => ({
    group: router.createCaller(await createContext(event)).groups.get(Number(event.params.id)),
    templates: router.createCaller(await createContext(event)).templates.list()
});
