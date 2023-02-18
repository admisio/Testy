import { t } from '$lib/trpc/t';
import { z } from 'zod';
import prisma from '$lib/prisma';
import { adminAuth } from '../middleware/adminAuth';

export const testTemplates = t.router({
    delete: t.procedure
        .use(adminAuth)
        .input(z.number())
        .mutation(async ({ input }) => {
            await prisma.testTemplate.deleteMany({
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
            await prisma.testTemplate.update({
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
            return prisma.testTemplate.findMany({ include: { questions: true } });
        }),
    get: t.procedure
        .use(adminAuth)
        .input(z.number())
        .query(async ({ input }) =>
            prisma.testTemplate.findUnique({
                where: {
                    id: input
                },
                include: {
                    questions: true
                }
            })
        )
});
