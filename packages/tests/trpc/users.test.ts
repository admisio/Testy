import { expect, test, beforeEach } from 'vitest';
import adminTrpc from '../trpc';
import { getTestData } from '../lib/data';

test('should list users', async () => {
    const { adminTrpc, USERS } = await getTestData();
    const users = await adminTrpc.users.list();
    const dbUsers = USERS.map(({id, name, email, surname, username}) => {
        return {
            id,
            name,
            email,
            surname,
            username
        };
    });
    expect(users).toEqual(dbUsers);
});
