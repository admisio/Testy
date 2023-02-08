import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
    await prisma.adminsOnGroups.deleteMany();
    await prisma.admin.deleteMany();
    await prisma.user.deleteMany();
    const admin = await prisma.admin.create({
        data: {
            name: 'Admin',
            surname: 'Admin',
            email: 'admin@ssps.cz',
            username: 'admin',
            password: await bcrypt.hash('admin', 12)
        }
    });
    await prisma.group.deleteMany();
    const group = await prisma.group.create({
        data: {
            name: 'Group'
        }
    });
    await prisma.adminsOnGroups.create({
        data: {
          adminId: admin.id,
          groupId: group.id
        }
    });
    await prisma.user.create({
        data: {
            name: 'User',
            surname: 'User',
            username: 'testuser',
            email: 'testuser@test.test',
            password: await bcrypt.hash('testuser', 12),
            group: {
              connect: {
                id: group.id
              }
            }
        }
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
