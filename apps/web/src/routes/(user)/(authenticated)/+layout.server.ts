import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

import { router } from '@testy/trpc/server/router';
import { createContext } from '@testy/trpc/server/createContext';

export const load: LayoutServerLoad = async (event) => {
    try {
        const auth = await router.createCaller(await createContext(event)).auth.user();
        return { isAuthenticated: true, userId: auth };
    } catch {
        throw redirect(302, '/auth/login');
    }
};
