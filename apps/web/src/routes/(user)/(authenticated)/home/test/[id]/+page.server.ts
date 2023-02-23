import { createContext } from 'trpc/context';
import { router } from 'trpc/router';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
    const res = await router
        .createCaller(await createContext(event))
        .assignments.get({ assignmentId: Number(event.params.id) });
    return {
        assignment: res.assignment,
        user: res.user
    };
};
