import { env } from '$env/dynamic/private';
import prisma from '$lib/prisma';
import { fail } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { Actions } from './$types';

export const actions: Actions = {
    default: async ({ request, cookies }) => {
        try {
            const data = await request.formData();
            const username = data.get('username')?.toString();
            const password = data.get('password')?.toString();

            if (!username || !password) {
                return fail(400, { message: 'username or password missing', incorrect: true });
            }

            const { id, password: passwordHash } = await prisma.admin.findFirstOrThrow({
                where: { username },
                select: { id: true, password: true }
            });
            if (!(await bcrypt.compare(password, passwordHash))) {
                return fail(401, { message: 'Authentication failed', incorrect: true });
            }

            cookies.set(
                'jwt',
                jwt.sign({ id: id, name: username, role: 'admin' }, env.JWT_SECRET, {
                    expiresIn: '1w',
                    algorithm: 'HS512'
                }),
                {
                    path: '/'
                }
            );

            return { success: true };
        } catch {
            return fail(401, { message: 'Authentication failed', incorrect: true });
        }
    }
};
