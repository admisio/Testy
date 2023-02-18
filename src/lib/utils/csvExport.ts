import prisma from '$lib/prisma';
import { createArrayCsvStringifier } from 'csv-writer';

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
            testSubmissions: {
                select: {
                    assignedTest: {
                        select: {
                            startTime: true,
                            endTime: true,
                            test: {
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
    console.log(users);
    const csvWriter = createArrayCsvStringifier({
        header: [
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
    });
    const csv =
        csvWriter.getHeaderString() +
        csvWriter.stringifyRecords(
            users.map((user) => {
                const testsJson = user.testSubmissions.map((test) => {
                    return {
                        testTitle: test.assignedTest.test.title,
                        startTime: test.assignedTest.startTime,
                        endTime: test.assignedTest.endTime,
                        evaluation: test.evaluation
                    };
                });
                return [
                    user.id,
                    user.username,
                    user.name,
                    user.surname,
                    user.email,
                    user.group!.name,
                    JSON.stringify(user.group!.admins.map((admin) => admin.admin)),
                    JSON.stringify(testsJson),
                    testsJson[0]?.testTitle,
                    testsJson[0]?.evaluation,
                    testsJson[1]?.testTitle,
                    testsJson[1]?.evaluation
                ];
            })
        );

    console.log(csv);
    return csv;
};
