import { t } from '$lib/trpc/t';
import { z } from 'zod';
import { adminAuth } from '../middleware/adminAuth';
import prisma from '$lib/prisma';

export const assignedTests = t.router({
    assignToGroup: t.procedure
        .use(adminAuth)
        .input(
            z.object({
                templateId: z.number(),
                groupId: z.number()
            })
        )
        .mutation(async ({ input }) => {
            const assignedTest = await prisma.assignedTest.create({
                data: {
                    test: {
                        connect: {
                            id: input.templateId
                        }
                    },
                    group: {
                        connect: {
                            id: input.groupId
                        }
                    },
                    started: false
                }
            });
            await prisma.group.update({
                where: {
                    id: input.groupId
                },
                data: {
                    assignedTests: {
                        connect: {
                            id: assignedTest.id
                        }
                    }
                }
            });
        }),
    start: t.procedure
        .use(adminAuth)
        .input(
            z.object({
                assignedTestId: z.number()
            })
        )
        .mutation(async ({ input }) => {
            await prisma.assignedTest.update({
                where: {
                    id: input.assignedTestId
                },
                data: {
                    started: true,
                    startTime: new Date(),
                    endTime: new Date()
                }
            });
        }),
    list: t.procedure
        .use(adminAuth)
        .input(z.string().optional())
        .query(async () => prisma.assignedTest.findMany())
});
