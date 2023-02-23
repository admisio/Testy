import { createContext } from 'trpc/context';
import { router } from 'trpc/router';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => ({
    template: router.createCaller(await createContext(event)).templates.get(Number(event.params.id))
});
