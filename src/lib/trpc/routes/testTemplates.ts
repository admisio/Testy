import { t } from '$lib/trpc/t';
import { z } from 'zod';
import prisma from '$lib/prisma';
import { adminAuth } from '../middleware/adminAuth';

export const testTemplates = t.router({
    create: t.procedure
        .use(adminAuth)
        .input(
            z.object({
                title: z.string(),
                questions: z.array(
                    z.object({
                        title: z.string(),
                        content: z.object({
                            description: z.string().optional(),
                            codeBlocks: z.array(z.string()).optional(),
                            images: z.array(z.string()).optional(),
                            answers: z.array(z.string())
                        })
                    })
                )
            })
        )
        .mutation(async ({ input }) => {
            await prisma.testTemplate.create({
                data: {
                    title: input.title
                }
            });
        }),
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
