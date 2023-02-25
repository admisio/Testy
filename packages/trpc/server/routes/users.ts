import { t, adminAuth } from '../trpc';
import { z } from 'zod';
import prisma from '@testy/database/client';
import { exportCsv } from '../../utils/csvExport';
import bcrypt from 'bcrypt';

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

    create: t.procedure
        .use(adminAuth)
        .input(
            z.object({
                name: z.string().optional(),
                surname: z.string().optional(),
                email: z.string().optional(),
                username: z.string(),
                password: z.string()
            })
        )
        .mutation(async ({ input }) => {
            await prisma.user.create({
                data: {
                    name: input.name,
                    surname: input.surname,
                    email: input.email,
                    username: input.username,
                    password: await bcrypt.hash(input.password, 12)
                }
            });
        }),
    csv: t.procedure.use(adminAuth).query(async () => exportCsv())
});
