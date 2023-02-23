import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

import { router } from 'trpc/router';
import { createContext } from 'trpc/context';

export const load: LayoutServerLoad = async (event) => {
    try {
        const auth = await router.createCaller(await createContext(event)).auth.admin();
        return { isAuthenticated: true, userId: auth };
    } catch {
        throw redirect(302, '/admin/auth/login');
    }
};
