import { createContext } from 'trpc/context';
import { router } from 'trpc/router';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
    const res = await router
        .createCaller(await createContext(event))
        .submissions.get({ assignmentId: Number(event.params.id) });
    return {
        submission: res
    };
};
