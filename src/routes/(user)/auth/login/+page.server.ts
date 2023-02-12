import { JWT_SECRET } from '$env/static/private';
import prisma from '$lib/prisma';
import { fail } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { Actions } from './$types';

export const actions: Actions = {
    default: async ({ request, cookies }) => {
        try {
            const data = await request.formData();

            const username = data.get('username') as string;
            const password = data.get('password') as string;

            const { id, password: passwordHash } = await prisma.user.findUniqueOrThrow({
                where: { username },
                select: { id: true, password: true }
            });

            if (!(await bcrypt.compare(password, passwordHash))) {
                return fail(401, { message: 'Authentication failed', incorrect: true });
            }

            cookies.set('jwt', jwt.sign({ id: id, name: username, role: 'user' }, JWT_SECRET), {
                path: '/'
            });

            return { success: true };
        } catch {
            return fail(401, { message: 'Authentication failed', incorrect: true });
        }
    }
};
