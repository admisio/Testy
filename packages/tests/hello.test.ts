import prisma from './client';
import { expect, it, beforeEach } from 'vitest';
import { resetDb } from './reset';

it('should say hello', async () => {
    const user = await prisma.user.create({
        data: {
            email: 'mail',
            name: 'jmeno',
            password: 'prijmeni',
            username: 'username2323',
        },
    });

    console.log(user);
    console.log(await prisma.user.findMany({}));
    expect('hello').toBe('hello')
    }
)

beforeEach(async () =>{
    await resetDb();
});