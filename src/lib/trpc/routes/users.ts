import { t } from '$lib/trpc/t';
import { z } from 'zod';
import { adminAuth } from '../middleware/adminAuth';
import prisma from '$lib/prisma';

export const users = t.router({
    list: t.procedure
        .use(adminAuth)
        .input(z.string().optional())
        .query(
            async () =>
                await prisma.user.findMany({
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        surname: true,
                        password: false,
                        username: true
                    }
                })
        )
});
