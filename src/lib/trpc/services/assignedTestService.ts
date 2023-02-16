import prisma from '$lib/prisma';
import { createSubmission } from './submissionService';

export const submitExpired = async (): Promise<void> => {
    const users = await prisma.user.findMany({
        include: {
            testSubmissions: true,
            group: {
                include: {
                    assignedTests: true
                }
            }
        }
    });
    users.forEach((user) => {
        const expAssignedTests = user.group.assignedTests.filter(
            (assignedTest) => assignedTest.endTime && assignedTest.endTime <= new Date()
        );
        const submittedTests = user.testSubmissions;
        const missingExpTests = expAssignedTests.filter(
            (assignedTest) =>
                !submittedTests.map((submission) => submission.id).includes(assignedTest.id)
        );

        missingExpTests.forEach(async (missingTest) => {
            await createSubmission(user.id, missingTest);
        });
    });
};
