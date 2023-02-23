import type { Actions } from './$types';
import { router } from '$lib/trpc/router';
import { createContext } from '$lib/trpc/context';
import { fail } from '@sveltejs/kit';

export const actions: Actions = {
    default: async (event) => {
        try {
            const data = await event.request.formData();

            const feedback = data.get('feedback')?.toString();

            if (!feedback) {
                return fail(400, { message: 'feedback missing', incorrect: true });
            }

            await router.createCaller(await createContext(event)).feedback.create({
                feedback: feedback
            });
            return { success: true };
        } catch {
            return fail(401, { message: 'Feedback failed', incorrect: true });
        }
    }
};
