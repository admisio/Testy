import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { parseMd } from '$lib/utils/mdParser';
import { createTest } from '$lib/trpc/services/testService';

export const actions: Actions = {
    default: async ({ request, cookies }) => {
        try {
            const data = await request.formData();
            const title = data.get('title') as string;
            const files = data.getAll('file').map((file) => file as Blob);

            console.log(title);
            const mdFile = files.find((file) => file.name.endsWith('.md')) as Blob;

            console.log(mdFile);

            const test = await parseMd(await mdFile.text());
            const createResult = await createTest(test);
            return createResult;
        } catch {
            return fail(500, { message: 'Parsing failed', incorrect: true });
        }
    }
};
