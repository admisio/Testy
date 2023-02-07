import { t } from '$lib/trpc/t';
import { z } from 'zod';
import { adminAuth } from '../middleware/adminAuth';
import prisma from '$lib/prisma';

export const assignedTests = t.router({
    create: t.procedure
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
                    testId: input.templateId,
                    groupId: input.groupId,
                    startTime: new Date(),
                    endTime: new Date()
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
    list: t.procedure
        .use(adminAuth)
        .input(z.string().optional())
        .query(async () => prisma.assignedTest.findMany())
});
