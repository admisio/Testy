import type { LayoutServerLoad } from './$types';
import { router } from '$lib/trpc/router';
import { createContext } from '$lib/trpc/context';

export const load: LayoutServerLoad = async (event) => {
    try {
        const auth = await router.createCaller(await createContext(event)).auth.admin();
        return { isAuthenticated: true, userId: auth };
    } catch {
        return { isAuthenticated: false };
    }
};
