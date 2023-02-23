import { createContext } from '@testy/trpc/server/createContext';
import { router } from '@testy/trpc/server/router';
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
