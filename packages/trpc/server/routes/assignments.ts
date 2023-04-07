import { t, adminAuth, userAuth } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { findUniqueWithSubmission } from '../query/user';
import { addMinutes } from 'date-fns';
import { createSubmission } from '../services/submissionService';
import { submitExpired } from '../services/assignmentService';
import prisma from '../../prisma';
import { randomOrder } from '../../utils/random';

export const assignments = t.router({
    assignToGroup: t.procedure
        .use(adminAuth)
        .input(
            z.object({
                templateId: z.number(),
                groupId: z.number()
            })
        )
        .mutation(async ({ input }) => {
            const assignment = await prisma.assignment.create({
                data: {
                    template: {
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
                    assignments: {
                        connect: {
                            id: assignment.id
                        }
                    }
                }
            });
        }),
    start: t.procedure
        .use(adminAuth)
        .input(
            z.object({
                assignmentId: z.number()
            })
        )
        .mutation(async ({ input }) => {
            const assignment = await prisma.assignment.findUniqueOrThrow({
                where: {
                    id: input.assignmentId
                },
                select: {
                    template: {
                        select: {
                            timeLimit: true
                        }
                    }
                }
            });
            const startTime = new Date();
            const endTime = addMinutes(startTime, assignment.template.timeLimit);
            await prisma.assignment.update({
                where: {
                    id: input.assignmentId
                },
                data: {
                    started: true,
                    startTime,
                    endTime
                }
            });
        }),
    list: t.procedure
        .use(adminAuth)
        .input(z.string().optional())
        .query(async () => prisma.assignment.findMany()),

    userList: t.procedure
        .use(userAuth)
        .input(z.string().optional())
        .query(async ({ ctx }) => {
            const user = await prisma.user.findUniqueOrThrow({
                where: {
                    id: Number(ctx.userId)
                }
            });
            return await prisma.assignment.findMany({
                where: {
                    group: {
                        users: {
                            some: {
                                id: user.id
                            }
                        }
                    }
                },
                include: {
                    template: {
                        select: {
                            title: true,
                            timeLimit: true,
                            maxScore: true
                        }
                    },
                    submissions: {
                        where: {
                            userId: user.id
                        },
                        select: {
                            assignmentId: true
                        }
                    }
                }
            });
        }),
    // user routes
    get: t.procedure
        .use(userAuth)
        .input(
            z.object({
                assignmentId: z.number()
            })
        )
        .query(async ({ ctx, input }) => {
            const user = await findUniqueWithSubmission(Number(ctx.userId), input.assignmentId);
            const assignment = await prisma.assignment.findUnique({
                where: {
                    id: input.assignmentId
                },
                include: {
                    template: {
                        include: {
                            headings: {
                                include: {
                                    questions: true
                                }
                            },
                            questions: {
                                select: {
                                    id: true,
                                    title: true,
                                    description: true,
                                    templateAnswers: true,
                                    headingId: true,
                                    submittedAnswers: {
                                        where: {
                                            assignment: {
                                                id: input.assignmentId
                                            },
                                            user: {
                                                id: user.id
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    submissions: {}
                }
            });
            if (!assignment) {
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Test not found' });
            }
            if (assignment?.groupId !== user?.groupId) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: 'Test was not assigned to your group'
                });
            }
            if (!assignment?.started) {
                throw new TRPCError({ code: 'FORBIDDEN', message: 'Test has not started yet' });
            }

            const questionsGroupedByHeading = assignment.template.headings
                .map((h) => assignment.template.questions.filter((q) => q.headingId === h.id) ?? [])
                .concat(assignment.template.questions.filter((question) => !question.headingId));

            // Create view if it doesn't exist
            const view =
                (await prisma.view.findUnique({
                    where: { user_assignment: { assignmentId: assignment.id, userId: user.id } }
                })) ??
                (await prisma.view.create({
                    data: {
                        user: {
                            connect: {
                                id: user.id
                            }
                        },
                        assignment: {
                            connect: {
                                id: assignment.id
                            }
                        },
                        questionOrder: randomOrder(questionsGroupedByHeading.length)
                    }
                }));

            // Sort questions by view order
            assignment.template.questions = view.questionOrder
                .flatMap((index) => {
                    return questionsGroupedByHeading[index];
                })
                .filter((q) => q !== undefined); // TODO: fix this undefined

            return { assignment, user };
        }),
    submitAnswer: t.procedure
        .use(userAuth)
        .input(
            z.object({
                assignmentId: z.number(),
                questionId: z.number(),
                answerIndex: z.number()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const user = await findUniqueWithSubmission(Number(ctx.userId), input.assignmentId);
            const assignment = await prisma.assignment.findUnique({
                where: {
                    id: input.assignmentId
                },
                include: {
                    template: {
                        include: {
                            questions: true
                        }
                    }
                }
            });
            if (user.submissions.length > 0) {
                throw new TRPCError({ code: 'FORBIDDEN', message: 'Test already submitted' });
            }
            if (!assignment) {
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Test not found' });
            }
            if (assignment?.groupId !== user?.groupId) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: 'Test was not assigned to your group'
                });
            }
            if (!assignment?.started || !assignment.endTime || new Date() > assignment.endTime) {
                throw new TRPCError({ code: 'FORBIDDEN', message: 'Test has not started yet' });
            }

            const answer = assignment.template.questions.find((q) => q.id === input.questionId)
                ?.templateAnswers[input.answerIndex];

            if (!answer) {
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Answer not found' });
            }

            await prisma.answer.upsert({
                where: {
                    user_question_test: {
                        userId: user.id,
                        questionId: input.questionId,
                        assignmentId: input.assignmentId
                    }
                },
                update: {
                    value: answer,
                    index: input.answerIndex
                },
                create: {
                    user: {
                        connect: {
                            id: user.id
                        }
                    },
                    question: {
                        connect: {
                            id: input.questionId
                        }
                    },
                    assignment: {
                        connect: {
                            id: input.assignmentId
                        }
                    },
                    value: answer,
                    index: input.answerIndex
                }
            });
        }),
    submitAllExpired: t.procedure.use(adminAuth).query(async ({ ctx }) => {
        await submitExpired();
    }),
    submittemplate: t.procedure
        .use(userAuth)
        .input(
            z.object({
                assignmentId: z.number()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const user = await findUniqueWithSubmission(Number(ctx.userId), input.assignmentId);
            const assignment = await prisma.assignment.findUniqueOrThrow({
                where: {
                    id: input.assignmentId
                }
            });

            if (!assignment?.started) {
                throw new TRPCError({ code: 'FORBIDDEN', message: 'Test has not started yet' });
            }

            if (user.submissions.length > 0) {
                throw new TRPCError({ code: 'FORBIDDEN', message: 'Test already submitted' });
            }

            if (assignment.groupId !== user.groupId) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: 'Test was not assigned to your group'
                });
            }

            await createSubmission(user.id, assignment);
        })
});
