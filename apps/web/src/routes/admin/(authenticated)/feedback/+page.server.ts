import { createContext } from '@testy/trpc/server/createContext';
import { router } from '@testy/trpc/server/router';
import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => ({
    feedback: router.createCaller(await createContext(event)).feedback.list()
});
