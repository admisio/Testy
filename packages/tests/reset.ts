import prisma from './client';
import { ADMIN, GROUPS, USERS } from './lib/data';

export async function resetDb(): Promise<void> {
    await prisma.$executeRaw`TRUNCATE "User" CASCADE;`;
    await prisma.$executeRaw`TRUNCATE "Group" CASCADE;`;
    await prisma.$executeRaw`TRUNCATE "Admin" CASCADE;`;

    await prisma.group.createMany({
        data: GROUPS
    });
    await prisma.user.createMany({
        data: USERS
    });
    await prisma.admin.create({
        data: {
            ...ADMIN,
        }
    })
}