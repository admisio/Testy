import type { RequestEvent } from '@sveltejs/kit';
import type { inferAsyncReturnType } from '@trpc/server';
import jwt from 'jsonwebtoken';

export async function createContext(event: RequestEvent) {
    try {
        const token = event.cookies.get('jwt');
        // 👆 or, if we're using HTTP headers based authentication, we could do something like this:
        // const token = event.request.headers.get('authorization')?.replace('Bearer ', '');

        const { id: userId, role } = jwt.verify(token || '', process.env.JWT_SECRET ?? 'token') as {
            id: string;
            role: Role;
        };

        return { userId, role };
    } catch {
        return { userId: '' };
    }
}

export type Role = 'admin' | 'user';

export type Context = inferAsyncReturnType<typeof createContext>;
