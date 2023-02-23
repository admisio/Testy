import prisma from '$lib/prisma';
import { createSubmission } from './submissionService';

export const submitExpired = async (): Promise<void> => {
    const users = await prisma.user.findMany({
        include: {
            submissions: true,
            group: {
                include: {
                    assignments: true
                }
            }
        }
    });
    users.forEach((user) => {
        const expAssignments = user.group?.assignments.filter(
            (assignment) => assignment.endTime && assignment.endTime <= new Date()
        );
        const submissions = user.submissions;
        const missingExpTests = expAssignments?.filter(
            (assignment) =>
                !submissions.map((submission) => submission.id).includes(assignment.id)
        );

        missingExpTests?.forEach(async (missingTest) => {
            await createSubmission(user.id, missingTest);
        });
    });
};
