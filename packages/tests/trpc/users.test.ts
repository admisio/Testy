import { expect, test, beforeEach } from 'vitest';
import { resetDb } from '../reset';
import adminTrpc from '../trpc';
import { USERS } from '../lib/data';

beforeEach(async () => {
    await resetDb();
});

test('should list users', async () => {
    const users = await adminTrpc.users.list();
    const dbUsers: typeof users = USERS.map((user) => {
        return {
            id: user.id,
            name: user.name,
            surname: user.surname,
            username: user.username,
            email: user.email
        };
    });
    expect(users).toEqual(dbUsers);
});
