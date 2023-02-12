import { createContext } from '$lib/trpc/context';
import { router } from '$lib/trpc/router';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => ({
    group: router.createCaller(await createContext(event)).groups.get(Number(event.params.id)),
    templates: router.createCaller(await createContext(event)).tests.list()
});