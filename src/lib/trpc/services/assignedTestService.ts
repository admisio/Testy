import prisma from '$lib/prisma';
import type { AssignedTest } from '@prisma/client';
import { createSubmission } from './submissionService';

export const createTestsExpirationHooks = async (): Promise<void> => {
    const assignedTests = await prisma.assignedTest.findMany({
        where: {    
            endTime: {
                gte: new Date()
            }
        }
    });
    assignedTests.forEach(async (assignedTest) => {
        await createTestExpirationHook(assignedTest);
    });
};

export const createTestExpirationHook = async (assignedTest: AssignedTest): Promise<void> => {
    if (!assignedTest.endTime) return;
    const endTime = assignedTest.endTime;
    const now = new Date();
    const diff = endTime.getTime() - now.getTime();
    if (diff < 0) return; // TODO: shouldn't be needed???
    setTimeout(() => {
        console.log('submitExpired ev fired');
        submitExpired();
    }, diff);
};

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
