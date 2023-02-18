import { t } from '$lib/trpc/t';
import { z } from 'zod';
import { adminAuth } from '../middleware/adminAuth';
import prisma from '$lib/prisma';
import { exportCsv } from '$lib/utils/csvExport';

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
        ),
    csv: t.procedure
        .use(adminAuth)
        .query(async () => exportCsv())
});
