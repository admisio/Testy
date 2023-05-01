import prisma from '../prisma';
import { stringify as csvStringify } from 'csv-stringify/sync';
import logger from '@testy/logging';

export const exportCsv = async (): Promise<string> => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            username: true,
            name: true,
            surname: true,
            email: true,
            group: {
                select: {
                    name: true,
                }
            },
            submissions: {
                select: {
                    assignment: {
                        select: {
                            id: true,
                            startTime: true,
                            endTime: true,
                            template: {
                                select: {
                                    title: true,
                                    type: true,
                                    timeLimit: true,
                                    maxScore: true
                                }
                            }
                        }
                    },
                    evaluation: true
                }
            },
            answers: {
                include: {
                    question: {
                        select: {
                            correctAnswer: true,
                        }
                    }
                }
            }
        }
    });
    const csv = csvStringify(
        users.map((user) => {
            const userAnswers = user.answers.map((answer) => {
                return {
                    id: answer.id,
                    assignmentId: answer.assignmentId,
                    questionId: answer.questionId,
                    correctAnswer: answer.question.correctAnswer,
                    value: answer.value,
                    evaluated: answer.evaluated,
                    evaluation: answer.evaluation
                }
            });

            const submittedTests = user.submissions.map((submission) => {
                return {
                    assignmentId: submission.assignment.id,
                    title: submission.assignment.template.title,
                    type: submission.assignment.template.type,
                    evaluation: submission.evaluation,
                    maxScore: submission.assignment.template.maxScore,
                    answers: userAnswers.filter((answer) => answer.assignmentId === submission.assignment.id)
                };
            });
            if (submittedTests.filter((test) => test.type === 'G').length > 1) {
                logger.error(`USER (${user.id}): More than one G test`);
            } else if (submittedTests.filter((test) => test.type === 'IT').length > 1) {
                logger.error(`USER (${user.id}): More than one IT test`);
            } else if (submittedTests.filter((test) => test.type === 'KB').length > 1) {
                logger.error(`USER (${user.id}): More than one KB test`);
            }

            const G = submittedTests.find((test) => test.type === 'G');
            const IT = submittedTests.find((test) => test.type === 'IT');
            const KB = submittedTests.find((test) => test.type === 'KB');
            return [
                user.id,
                user.username,
                user.name,
                user.surname,
                user.email,
                user.group?.name,
                G?.title,
                JSON.stringify(G?.answers),
                G?.evaluation,
                G?.maxScore,
                IT?.title,
                JSON.stringify(IT?.answers),
                IT?.evaluation,
                IT?.maxScore,
                KB?.title,
                JSON.stringify(KB?.answers),
                KB?.evaluation,
                KB?.maxScore
            ];
        }),
        {
            header: true,
            columns: [
                'Database ID',
                'Username',
                'Jméno',
                'Příjmení',
                'Email',
                'Skupina',
                'G - název',
                'G - odpovědi',
                'G - body',
                'G - max',
                'IT - název',
                'IT - odpovědi',
                'IT - body',
                'IT - max',
                'KB - název',
                'KB - odpovědi',
                'KB - body',
                'KB - max'
            ]
        }
    );
    return csv;
};
