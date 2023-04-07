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
            const submission = await prisma.submission.findUnique({
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
                                    headings: true,
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
            if (!submission) throw new Error('Test not found');
            
            const template = submission.assignment.template;
            const questionsGroupedByHeading = template.headings
                .map((h) => template.questions.filter((q) => q.headingId === h.id) ?? [])
                .concat(template.questions.filter((question) => !question.headingId));

            submission.assignment.template.questions = questionsGroupedByHeading.flat();

            return submission;
        }),

    get: t.procedure
        .use(userAuth)
        .input(
            z.object({
                assignmentId: z.number()
            })
        )
        .query(async ({ ctx, input }) => {
            const submission = await prisma.submission.findUnique({
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
                                    maxScore: true,
                                    headings: true
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
            if (!submission) throw new Error('Submission not found');

            const view = await prisma.view.findUniqueOrThrow({
                where: {
                    user_assignment: {
                        assignmentId: input.assignmentId,
                        userId: Number(ctx.userId)
                    }
                }
            });
            const template = submission.assignment.template;
            const questionsGroupedByHeading = template.headings
                .map((h) => template.questions.filter((q) => q.headingId === h.id) ?? [])
                .concat(template.questions.filter((question) => !question.headingId));

            submission.assignment.template.questions = view.questionOrder
                .flatMap((index) => {
                    return questionsGroupedByHeading[index];
                })
                .filter((q) => q !== undefined); // TODO: fix this

            return submission;
        })
});
