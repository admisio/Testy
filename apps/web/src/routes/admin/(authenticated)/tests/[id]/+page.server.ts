import { createContext } from '@testy/trpc/server/createContext';
import { router } from '@testy/trpc/server/router';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => ({
    template: router.createCaller(await createContext(event)).templates.get(Number(event.params.id))
});
