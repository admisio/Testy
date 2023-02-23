import prisma from '$lib/prisma';

export const findUniqueWithSubmission = async (id: number, assignmentId: number) => prisma.user.findUniqueOrThrow({
    where: {
        id
    },
    include: {
        submissions: {
            where: {
                assignment: {
                    id: assignmentId
                }
            }
        }
    }
});