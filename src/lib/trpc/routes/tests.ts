import { t } from '$lib/trpc/t';
import { z } from 'zod';
import prisma from '$lib/prisma';
import { adminAuth } from '../middleware/adminAuth';

export const tests = t.router({
    create: t.procedure
        .input(z.object({
            title: z.string(),
            content: z.string()
        })
    ).mutation(async ({ input }) => {
        await prisma.testTemplate.create({
            data: {
                title: input.title
            }
        });
    }),
    list: t.procedure
        .use(adminAuth)
        .input(z.string().optional())
        .query(async ({ input }) => {
            return prisma.testTemplate.findMany();
        })
});