import { createContext } from 'trpc/context';
import { router } from 'trpc/router';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => ({
    group: router.createCaller(await createContext(event)).groups.get(Number(event.params.id)),
    templates: router.createCaller(await createContext(event)).templates.list()
});
