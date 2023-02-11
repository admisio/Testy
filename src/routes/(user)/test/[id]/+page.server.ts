import { createContext } from '$lib/trpc/context';
import { router } from '$lib/trpc/router';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
    const res = await router
        .createCaller(await createContext(event))
        .assignedTests.get({ assignedTestId: Number(event.params.id) })
    return {
        test: res.assignedTest,
        user: res.user,
    }
};
