import prisma from '$lib/prisma';
import { stringify as csvStringify } from 'csv-stringify/sync';

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
                    admins: {
                        select: {
                            admin: {
                                select: {
                                    username: true,
                                    name: true,
                                    surname: true
                                }
                            }
                        }
                    }
                }
            },
            submissions: {
                select: {
                    assignment: {
                        select: {
                            startTime: true,
                            endTime: true,
                            template: {
                                select: {
                                    title: true,
                                    timeLimit: true
                                }
                            }
                        }
                    },
                    evaluation: true
                }
            }
        }
    });
    const csv = csvStringify(
        users.map((user) => {
            const testsJson = user.submissions.map((submission) => {
                return {
                    templateTitle: submission.assignment.template.title,
                    startTime: submission.assignment.startTime,
                    endTime: submission.assignment.endTime,
                    evaluation: submission.evaluation
                };
            });
            return [
                user.id,
                user.username,
                user.name,
                user.surname,
                user.email,
                user.group?.name,
                JSON.stringify(user.group?.admins.map((admin) => admin.admin)),
                JSON.stringify(testsJson),
                testsJson[0]?.templateTitle,
                testsJson[0]?.evaluation,
                testsJson[1]?.templateTitle,
                testsJson[1]?.evaluation
            ];
        }),
        {
            header: true,
            columns: [
                'Database ID',
                'Ev.č.',
                'Jméno',
                'Příjmení',
                'Email',
                'Název skupiny',
                'Učitelé - JSON',
                'Testy - JSON',
                'První test',
                'První test - body',
                'Druhý test',
                'Druhý test - body'
            ]
        }
    );
    console.log(csv);
    return csv;
};
