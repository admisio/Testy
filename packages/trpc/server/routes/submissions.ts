import { t, adminAuth, userAuth } from '../trpc';
import { z } from 'zod';
import prisma from '../../prisma';

export const submissions = t.router({
    list: t.procedure
        .use(adminAuth)
        .input(
            z.object({
                groupId: z.number().optional()
            })
        )
        .query(async ({ input }) =>
            prisma.submission.findMany({
                where: {
                    assignment: {
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
                assignmentId: z.number()
            })
        )
        .query(async ({ input }) => {
            const test = await prisma.submission.findUnique({
                where: {
                    user_test: {
                        assignmentId: input.assignmentId,
                        userId: input.userId
                    }
                },
                include: {
                    user: true,
                    assignment: {
                        select: {
                            id: true,
                            template: {
                                select: {
                                    id: true,
                                    title: true,
                                    questions: true,
                                    maxScore: true
                                }
                            },
                            submittedAnswers: {
                                where: {
                                    assignment: {
                                        // TODO: je tohle potřeba?
                                        id: input.assignmentId
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
                assignmentId: z.number()
            })
        )
        .query(async ({ ctx, input }) => {
            const test = await prisma.submission.findUnique({
                where: {
                    user_test: {
                        assignmentId: input.assignmentId,
                        userId: Number(ctx.userId)
                    }
                },
                include: {
                    user: true,
                    assignment: {
                        select: {
                            id: true,
                            template: {
                                select: {
                                    id: true,
                                    title: true,
                                    questions: true,
                                    maxScore: true
                                }
                            },
                            submittedAnswers: {
                                where: {
                                    assignment: {
                                        // TODO: je tohle potřeba?
                                        id: input.assignmentId
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
