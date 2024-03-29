import { t, adminAuth } from '../trpc';
import { z } from 'zod';
import prisma from '../../prisma';
import { trpcInfo, trpcWarn } from '../../utils/logging';

export const templates = t.router({
    delete: t.procedure
        .use(adminAuth)
        .input(z.number())
        .mutation(async ({ ctx, input }) => {
            await prisma.template.deleteMany({
                where: {
                    id: input
                }
            });
            trpcWarn(ctx, `Deleted template ${input}`);
        }),
    rename: t.procedure
        .use(adminAuth)
        .input(
            z.object({
                id: z.number(),
                title: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            await prisma.template.update({
                where: {
                    id: input.id
                },
                data: {
                    title: input.title
                }
            });
            trpcInfo(ctx, `Renamed template ${input.id} to ${input.title}`);
        }),
    list: t.procedure
        .use(adminAuth)
        .input(z.string().optional())
        .query(async () => {
            return prisma.template.findMany({
                select: {
                    id: true,
                    title: true,
                    maxScore: true,
                    timeLimit: true
                }
            });
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
                    questions: true,
                    headings: true
                }
            })
        )
});
