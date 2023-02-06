import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
  await prisma.admin.deleteMany();
  await prisma.admin.create({
    data: {
      name: 'Admin',
      surname: 'Admin',
      email: 'admin@ssps.cz',
      username: 'admin',
      password: await bcrypt.hash('admin', 12),
    },
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
