import prisma from '@testy/database/client';
import { exec, execSync } from 'node:child_process';
import { ADMIN, GROUPS, QUESTIONS, TEMPLATE, USERS } from './lib/data';

// export async function resetDb(): Promise<void> {
//     await prisma.$transaction([
//         // prisma.$executeRaw`TRUNCATE TABLE "Admin" CASCADE`,
//         // prisma.$executeRaw`TRUNCATE TABLE "Group" CASCADE`,
//         // prisma.$executeRaw`TRUNCATE TABLE "User" CASCADE`,
//         // prisma.$executeRaw`TRUNCATE TABLE "Template" CASCADE`,
//         // prisma.$executeRaw`TRUNCATE TABLE "Question" CASCADE`,
//         // prisma.$executeRaw`TRUNCATE TABLE "Heading" CASCADE`,
//         // prisma.$executeRaw`TRUNCATE TABLE "Submission" CASCADE`,
//         // prisma.$executeRaw`TRUNCATE TABLE "Assignment" CASCADE`,
//         // prisma.$executeRaw`TRUNCATE TABLE "AdminsOnGroups" CASCADE`,
//         // prisma.$executeRaw`TRUNCATE TABLE "Admin" RESTART IDENTITY`,
//         // prisma.$executeRaw`TRUNCATE TABLE "Group" RESTART IDENTITY`,
//         // prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY`,
//         // prisma.$executeRaw`TRUNCATE TABLE "Template" RESTART IDENTITY`,
//         // prisma.$executeRaw`TRUNCATE TABLE "Question" RESTART IDENTITY`,
//         // prisma.$executeRaw`TRUNCATE TABLE "Heading" RESTART IDENTITY`,
//         // prisma.$executeRaw`TRUNCATE TABLE "Submission" RESTART IDENTITY`,
//         // prisma.$executeRaw`TRUNCATE TABLE "Assignment" RESTART IDENTITY`

//         // prisma.admin.create({data: ADMIN}),
//         // prisma.group.createMany({data: GROUPS}),
//         // prisma.user.createMany({data: USERS}),
//         // prisma.template.create({data: TEMPLATE}),
//         // prisma.question.createMany({data: QUESTIONS})
//     ]);
//     /* await prisma.$executeRawUnsafe(`CREATE TABLE "Admin" (
//         "id" SERIAL NOT NULL,
//         "username" TEXT NOT NULL,
//         "name" TEXT NOT NULL,
//         "surname" TEXT NOT NULL,
//         "email" TEXT NOT NULL,
//         "password" TEXT NOT NULL,
//         "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
//         "updatedAt" TIMESTAMP(3) NOT NULL,
    
//         CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
//     );`)
//     await prisma.$executeRawUnsafe(`CREATE TABLE "Group" (
//         "id" SERIAL NOT NULL,
//         "name" TEXT NOT NULL,
//         "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
//         "updatedAt" TIMESTAMP(3) NOT NULL,
    
//         CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
//     );`); */


//     // console.log('=====================')
//     // console.log((await prisma.user.findMany({})));
//     // console.log((await prisma.group.findMany({})));
    // await prisma.group.createMany({
    //     data: GROUPS
    // });
    // await prisma.user.createMany({
    //     data: USERS
    // });
    // await prisma.admin.create({
    //     data: ADMIN
    // })
    // await prisma.template.create({
    //     data: {
    //         ...TEMPLATE
    //     }
    // })
    // await prisma.question.createMany({
    //     data: QUESTIONS
    // })
// }


export const resetDb = async (): Promise<void> => {
    await prisma.submission.deleteMany()
    await prisma.answer.deleteMany()
    // await prisma.user.deleteMany();
    await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;
    await prisma.adminsOnGroups.deleteMany()
    await prisma.admin.deleteMany()
    await prisma.assignment.deleteMany()
    await prisma.template.deleteMany()
    await prisma.question.deleteMany()
    await prisma.group.deleteMany()

    await prisma.group.createMany({
        data: GROUPS
    });
    const groups = await prisma.group.findMany();
    console.log("findMany", await prisma.user.findMany({}));
    console.log(USERS);
    await prisma.user.createMany({
        data: USERS.map(user => ({
            ...user,
            groupId: groups[0].id
        }))
    });
    await prisma.admin.create({
        data: ADMIN
    })
    await prisma.template.create({
        data: TEMPLATE
    })
    const template = await prisma.template.findFirstOrThrow();
    await prisma.question.createMany({
        data: QUESTIONS.map(question => ({
            ...question,
            testId: template.id
        }))
    })
}