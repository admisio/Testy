import prisma from '../client';
import { expect, test, beforeEach } from 'vitest';
import { resetDb } from '../reset';
import trpc from '../trpc';

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
    console.log(user);
    await trpc.groups.create({
        name: 'test',
        users: [user.id]
    });

    const groups = await prisma.group.findMany({});
    expect(groups).toHaveLength(3);

});

