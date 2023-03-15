import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { parseMd } from '$lib/utils/mdParser';
import { createTest } from '@testy/trpc/server/services/testService';

import { createContext } from '@testy/trpc/server/createContext';
import { router } from '@testy/trpc/server/router';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => ({
    templates: router
        .createCaller(await createContext(event))
        .templates.list(event.url.searchParams.get('q') || undefined)
});

export const actions: Actions = {
    default: async ({ request }) => {
        try {
            const data = await request.formData();

            const timeLimit = data.get('timeLimit')?.toString() ?? '20';

            // const files = data.getAll('file').map((file) => file as Blob);
            const mdFile = data.get('file') as Blob;

            const test = await parseMd(await mdFile.text(), Number(timeLimit));

            await createTest(test);

            return { success: true };
        } catch (e) {
            console.error(e);
            return fail(500, { message: 'Parsing failed', incorrect: true });
        }
    }
};
