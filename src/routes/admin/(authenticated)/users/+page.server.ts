import { createContext } from '$lib/trpc/context';
import { router } from '$lib/trpc/router';
import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => ({
    users: router.createCaller(await createContext(event)).users.list()
});

export const actions: Actions = {
    default: async (event) => {
        try {
            const data = await event.request.formData();

            const name = data.get('name')?.toString();
            const surname = data.get('surname')?.toString();
            const email = data.get('email')?.toString();
            // TODO: Fix !
            const username = data.get('username')!.toString();
            const password = data.get('password')!.toString();

            const createResult = await router
                .createCaller(await createContext(event))
                .users.create({
                    name,
                    surname,
                    email,
                    username,
                    password
                });
            return createResult;
        } catch (e) {
            console.error(e);
            return fail(500, { message: 'User creation failed', incorrect: true });
        }
    }
};
