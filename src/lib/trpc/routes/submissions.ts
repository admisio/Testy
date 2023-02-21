import { t } from '$lib/trpc/t';
import { z } from 'zod';
import { adminAuth } from '../middleware/adminAuth';
import prisma from '$lib/prisma';
import { userAuth } from '../middleware/userAuth';

export const submissions = t.router({
    list: t.procedure
        .use(adminAuth)
        .input(
            z.object({
                groupId: z.number().optional()
            })
        )
        .query(async ({ input }) =>
            prisma.testSubmission.findMany({
                where: {
                    assignedTest: {
                        group: {
                            id: input.groupId
                        }
                    }
                }
            })
        ),
    getUserSubmission: t.procedure
        .use(adminAuth)
        .input(
            z.object({
                userId: z.number(),
                assignedTestId: z.number()
            })
        )
        .query(async ({ input }) => {
            const test = await prisma.testSubmission.findUnique({
                where: {
                    user_test: {
                        testId: input.assignedTestId,
                        userId: input.userId
                    }
                },
                include: {
                    user: true,
                    assignedTest: {
                        select: {
                            id: true,
                            test: {
                                select: {
                                    id: true,
                                    title: true,
                                    questions: true,
                                    maxScore: true
                                }
                            },
                            submittedAnswers: {
                                where: {
                                    assignedTest: { // TODO: je tohle potřeba?
                                        id: input.assignedTestId
                                    },
                                    user: {
                                        id: Number(input.userId)
                                    }
                                }
                            },
                            startTime: true,
                            endTime: true
                        }
                    }
                }
            });
            if (!test) throw new Error('Test not found');
            return test;
        }),

    get: t.procedure
        .use(userAuth)
        .input(
            z.object({
                assignedTestId: z.number()
            })
        )
        .query(async ({ ctx, input }) => {
            const test = await prisma.testSubmission.findUnique({
                where: {
                    user_test: {
                        testId: input.assignedTestId,
                        userId: Number(ctx.userId)
                    }
                },
                include: {
                    user: true,
                    assignedTest: {
                        select: {
                            id: true,
                            test: {
                                select: {
                                    id: true,
                                    title: true,
                                    questions: true,
                                    maxScore: true
                                }
                            },
                            submittedAnswers: {
                                where: {
                                    assignedTest: { // TODO: je tohle potřeba?
                                        id: input.assignedTestId
                                    },
                                    user: {
                                        id: Number(ctx.userId)
                                    }
                                }
                            },
                            startTime: true,
                            endTime: true
                        }
                    }
                }
            });
            if (!test) throw new Error('Test not found');
            return test;
        })
});
