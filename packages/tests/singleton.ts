import { PrismaClient } from '@prisma/client'

import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'


import prisma from './client'
import { beforeEach, vitest } from 'vitest'


vitest.mock('./client', () => ({

  __esModule: true,

  default: mockDeep<PrismaClient>(),
}))


beforeEach(() => {
  mockReset(prismaMock)
})


export const prismaMock: PrismaClient = prisma as unknown as DeepMockProxy<typeof prisma>