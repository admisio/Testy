import { createContext } from '$lib/trpc/context';
import { router } from '$lib/trpc/router';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => ({
    template: router
        .createCaller(await createContext(event))
        .tests.get(Number(event.params.id))
});
