import { JWT_SECRET } from '$env/static/private';
import { fail } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import type { Actions } from './$types';
import { adminContextValid } from '$lib/trpc/middleware/adminAuth';
import type { Context } from '$lib/trpc/context';
import { parseMd } from '$lib/trpc/utils/mdParser';
import { createTest } from '$lib/trpc/services/questionService';

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    /* const token = cookies.get('jwt');
    const { userId, role } = jwt.verify(token || '', JWT_SECRET) as Context;
    if (!adminContextValid({ userId, role }).ok) {
      return fail(401, { message: 'Authentication failed', incorrect: true });
    } */
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
