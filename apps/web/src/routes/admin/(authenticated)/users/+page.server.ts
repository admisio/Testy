import { createContext } from '@testy/trpc/server/createContext';
import { router } from '@testy/trpc/server/router';
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

            const username = data.get('username')?.toString();
            const password = data.get('password')?.toString();

            if (!username || !password) {
                return fail(400, { message: 'Missing username & password', incorrect: true });
            }

            await router.createCaller(await createContext(event)).users.create({
                name,
                surname,
                email,
                username,
                password
            });

            return { success: true };
        } catch (e) {
            console.error(e);
            return fail(500, { message: 'User creation failed', incorrect: true });
        }
    }
};
