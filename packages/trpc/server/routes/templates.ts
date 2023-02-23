import { t, adminAuth } from '../trpc';
import { z } from 'zod';
import prisma from '../../prisma';

export const templates = t.router({
    delete: t.procedure
        .use(adminAuth)
        .input(z.number())
        .mutation(async ({ input }) => {
            await prisma.template.deleteMany({
                where: {
                    id: input
                }
            });
        }),
    rename: t.procedure
        .use(adminAuth)
        .input(
            z.object({
                id: z.number(),
                title: z.string()
            })
        )
        .mutation(async ({ input }) => {
            await prisma.template.update({
                where: {
                    id: input.id
                },
                data: {
                    title: input.title
                }
            });
        }),
    list: t.procedure
        .use(adminAuth)
        .input(z.string().optional())
        .query(async () => {
            return prisma.template.findMany({ include: { questions: true } });
        }),
    get: t.procedure
        .use(adminAuth)
        .input(z.number())
        .query(async ({ input }) =>
            prisma.template.findUnique({
                where: {
                    id: input
                },
                include: {
                    questions: true
                }
            })
        )
});
