import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { parseMd } from '$lib/utils/mdParser';
import { createTest } from 'trpc/services/testService';

import { createContext } from 'trpc/context';
import { router } from 'trpc/router';
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

            const files = data.getAll('file').map((file) => file as Blob);

            const mdFile = files.find((file) => file.name.endsWith('.md')) as Blob;

            console.log(mdFile);

            const test = await parseMd(await mdFile.text(), Number(timeLimit));

            await createTest(test);

            return { success: true };
        } catch (e) {
            console.error(e);
            return fail(500, { message: 'Parsing failed', incorrect: true });
        }
    }
};
