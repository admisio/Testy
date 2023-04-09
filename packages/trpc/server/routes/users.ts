import { t, adminAuth } from '../trpc';
import { z } from 'zod';
import prisma from '../../prisma';
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
    csv: t.procedure.use(adminAuth).query(async () => exportCsv()),
    resetPassword: t.procedure
        .use(adminAuth)
        .input(
            z.object({
                id: z.number()
            })
        )
        .mutation(async ({ input }) => {
            const password = Math.random().toString(36).slice(-8);

            await prisma.user.update({
                where: {
                    id: input.id
                },
                data: {
                    password: await bcrypt.hash(password, 12)
                }
            });

            return password;
        }),
    delete: t.procedure
        .use(adminAuth)
        .input(
            z.object({
                id: z.number()
            })
        )
        .mutation(async ({ input }) => {
            await prisma.user.delete({
                where: {
                    id: input.id
                }
            });
        })
});
