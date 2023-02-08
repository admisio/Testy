import prisma from '$lib/prisma';

export const findUniqueWithSubmission = async (id: number, assignedTestId: number) => prisma.user.findUniqueOrThrow({
    where: {
        id
    },
    include: {
        testSubmissions: {
            where: {
                assignedTest: {
                    id: assignedTestId
                }
            }
        }
    }
});