import prisma from '@testy/database/client';
import { expect, test, beforeEach } from 'vitest';
import { resetDb } from '../reset';
import adminTrpc from '../trpc';

beforeEach(async () => {
    await resetDb();
});

test('should create group', async () => {
    const user = await prisma.user.create({
        data: {
            email: 'mail',
            password: 'prijmeni',
            username: 'username2323'
        }
    });
    await adminTrpc.groups.create({
        name: 'test',
        users: [user.id]
    });

    const groups = await prisma.group.findMany({});
    expect(groups).toHaveLength(3);
});
