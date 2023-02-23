import { createContext } from '$lib/trpc/context';
import { router } from '$lib/trpc/router';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
    const res = await router
        .createCaller(await createContext(event))
        .assignments.get({ assignmentId: Number(event.params.id) })
    return {
        assignment: res.assignment,
        user: res.user,
    }
};
