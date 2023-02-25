import prisma from '@testy/database/client';
import { ADMIN, GROUPS, QUESTIONS, TEMPLATE, USERS } from './lib/data';

export async function resetDb(): Promise<void> {
    await prisma.$executeRaw`TRUNCATE "User" CASCADE;`;
    await prisma.$executeRaw`TRUNCATE "Group" CASCADE;`;
    await prisma.$executeRaw`TRUNCATE "Admin" CASCADE;`;
    await prisma.$executeRaw`TRUNCATE "Template" CASCADE;`;
    await prisma.$executeRaw`TRUNCATE "Question" CASCADE;`;

    await prisma.group.createMany({
        data: GROUPS
    });
    await prisma.user.createMany({
        data: USERS
    });
    await prisma.admin.create({
        data: ADMIN
    })
    await prisma.template.create({
        data: {
            ...TEMPLATE
        }
    })
    await prisma.question.createMany({
        data: QUESTIONS
    })
}