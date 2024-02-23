/* eslint-disable @typescript-eslint/ban-ts-comment */
import fs from 'fs';
import path from 'path';
import prisma from './prisma';
import bcrypt from 'bcrypt';
import { program } from 'commander';

async function main({
    usersFile,
    passwordsFile,
    outputFile,
    superadminFile
}: {
    usersFile: string;
    passwordsFile: string;
    outputFile: string;
    superadminFile: string;
}) {
    const superadminPassword = fs.readFileSync(path.join(__dirname, superadminFile), 'utf8');
    const lines = fs.readFileSync(path.join(__dirname, usersFile), 'utf8').split('\n');
    const passwords = fs.readFileSync(path.join(__dirname, passwordsFile), 'utf8').split('\n');

    let passIndex = 0;

    const adminLogins: string[] = [];

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
            password: bcrypt.hashSync(superadminPassword, 12)
        }
    });

    for (const line of lines) {
        if (!line) {
            continue;
        }
        const [group, admin, username, password] = line.split(' ');
        let dbAdmin = await prisma.admin.findUnique({
            where: {
                username: admin
            }
        });
        if (!dbAdmin) {
            const password = passwords[passIndex++];
            dbAdmin = await prisma.admin.create({
                data: {
                    username: admin,
                    name: admin,
                    surname: admin,
                    email: admin,
                    password: bcrypt.hashSync(password, 12)
                }
            });
            adminLogins.push(`${admin} ${password}`);
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

    // if file doesn't exist, it will be created
    fs.writeFileSync(path.join(__dirname, outputFile), adminLogins.join('\n'));
    console.log(adminLogins);
}
console.log(process.argv);
program
    .option('-u, --usersfile <usersfile>', 'Path to users file (default users.txt)', 'users.txt')
    .option(
        '-p, --passwordsfile <passwordsfile>',
        'Path to passwords file (default passwords.txt)',
        'passwords.txt'
    )
    .option(
        '-o, --output <output>',
        'Path to output file with admin logins (default: admins.txt)',
        'admins.txt'
    )
    .option(
        '-s, --superadminfile <superadminfile>',
        'Path to superadmin password (default: superadmin.txt)',
        'superadmin.txt'
    )
    .parse(process.argv);

const options = program.opts();

const {
    usersfile: usersFile,
    passwordsfile: passwordsFile,
    output: outputFile,
    superadminfile: superadminFile
} = options;

if (!usersFile || !passwordsFile || !outputFile || !superadminFile) {
    console.error('Missing arguments');
    process.exit(1);
}

main({ usersFile, passwordsFile, outputFile, superadminFile }).then(() => {
    console.log('done');
    process.exit(0);
});
