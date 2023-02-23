import { PrismaClient } from '@prisma/client';

// @ts-ignore
const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') {
  // @ts-ignore
  global.prisma = prisma;
}

export default prisma;
