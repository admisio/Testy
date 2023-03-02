import prisma from '@testy/database/client';
import { exec, execSync } from 'node:child_process';
import { ADMIN, GROUPS, QUESTIONS, TEMPLATE, USERS } from './lib/data';


// TODO: use this instead??
export const deleteDb = async (): Promise<void> => {
    await prisma.$transaction([
        prisma.submission.deleteMany(),
        prisma.answer.deleteMany(),
        prisma.user.deleteMany(),
        prisma.adminsOnGroups.deleteMany(),
        prisma.admin.deleteMany(),
        prisma.assignment.deleteMany(),
        prisma.template.deleteMany(),
        prisma.question.deleteMany(),
        prisma.group.deleteMany()
    ]);
};

export const resetDb = async (): Promise<void> => {
    await prisma.submission.deleteMany();
    await prisma.answer.deleteMany();
    await prisma.user.deleteMany();
    await prisma.adminsOnGroups.deleteMany();
    await prisma.admin.deleteMany();
    await prisma.assignment.deleteMany();
    await prisma.template.deleteMany();
    await prisma.question.deleteMany();
    await prisma.group.deleteMany();

    await prisma.group.createMany({
        data: GROUPS
    });
    const groups = await prisma.group.findMany();
    const users = await prisma.user.findMany();
    console.log(users);
    await prisma.user.createMany({
        data: USERS.map((user) => ({
            ...user,
            groupId: groups[0].id
        }))
    });
    const newUsers = await prisma.user.findMany();
    // console.log(newUsers)
    await prisma.admin.create({
        data: ADMIN
    });
    await prisma.template.create({
        data: TEMPLATE
    });
    const template = await prisma.template.findFirstOrThrow();
    await prisma.question.createMany({
        data: QUESTIONS.map((question) => ({
            ...question,
            testId: template.id
        }))
    });
};
