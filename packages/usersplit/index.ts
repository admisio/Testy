import fs from 'fs';
import path from 'path';
import prisma from './prisma';
import bcrypt from 'bcrypt';

async function main() {
    const lines = fs.readFileSync(path.join(__dirname, 'users.txt'), 'utf8').split('\n');

    await prisma.$executeRaw`TRUNCATE TABLE "User" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "Group" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "Admin" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "AdminsOnGroups" CASCADE`;
    // reset autoincrement
    await prisma.$executeRaw`ALTER SEQUENCE "Group_id_seq" RESTART WITH 1`;
    await prisma.$executeRaw`ALTER SEQUENCE "Admin_id_seq" RESTART WITH 1`;
    await prisma.$executeRaw`ALTER SEQUENCE "User_id_seq" RESTART WITH 1`;
    await prisma.$executeRaw`ALTER SEQUENCE "AdminsOnGroups_id_seq" RESTART WITH 1`;

    const superadmin = await prisma.admin.create({
        data: {
            name: 'Superadmin',
            surname: 'Superadmin',
            email: 'superadmin',
            username: 'superadmin',
            password: bcrypt.hashSync('REDACTED', 12)
        }
    });

    for (const line of lines) {
        const [group, admin, username, password] = line.split(' ');
        let dbAdmin = await prisma.admin.findUnique({
            where: {
                username: admin
            }
        });
        if (!dbAdmin) {
            dbAdmin = await prisma.admin.create({
                data: {
                    username: admin,
                    name: admin,
                    surname: admin,
                    email: admin,
                    password: bcrypt.hashSync('REDACTED', 12)
                }
            });
        }

        let dbGroup = await prisma.group.findUnique({
            where: {
                name: group
            }
        });
        if (!dbGroup) {
            dbGroup = await prisma.group.create({
                data: {
                    name: group
                }
            });

            await prisma.adminsOnGroups.createMany({
                data: [
                    {
                        adminId: superadmin.id,
                        groupId: dbGroup.id
                    },
                    {
                        adminId: dbAdmin.id,
                        groupId: dbGroup.id
                    }
                ]
            });
        }

        const dbUser = await prisma.user.create({
            data: {
                username,
                password: bcrypt.hashSync(password, 10),
                group: {
                    connect: {
                        id: dbGroup.id
                    }
                }
            }
        });

        console.log(dbUser);
    }
}


main().then(() => {
    console.log('done');
});