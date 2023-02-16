import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { parseMd } from '$lib/utils/mdParser';
import { createTest } from '$lib/trpc/services/testService';

import { createContext } from '$lib/trpc/context';
import { router } from '$lib/trpc/router';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => ({
    tests: router
        .createCaller(await createContext(event))
        .tests.list(event.url.searchParams.get('q') || undefined)
});

export const actions: Actions = {
    default: async ({ request }) => {
        try {
            const data = await request.formData();
            const timeLimit = data.get('timeLimit') as string;
            const files = data.getAll('file').map((file) => file as Blob);

            const mdFile = files.find((file) => file.name.endsWith('.md')) as Blob;

            console.log(mdFile);

            const test = await parseMd(await mdFile.text(), Number(timeLimit));
            const createResult = await createTest(test);
            return createResult;
        } catch {
            return fail(500, { message: 'Parsing failed', incorrect: true });
        }
    }
};
