/* import { t } from '$lib/trpc/t';
import { z } from 'zod';

export const admin = t.router({
    login: t.procedure
        .input(z.object({
            username: z.string(),
            password: z.string()
        })
    ).query(async ({ input }) => {
        try {
            const data = await request.formData();
            const email = data.get('email') as string;
            const password = data.get('password') as string;
      
            // 👇 replace this with a non-naiive hashing algorithm
            const passwordHash = await md5(password);
      
            const { id, name } = await prisma.user.findFirstOrThrow({
              where: { email, password: passwordHash },
              select: { id: true, name: true }
            });
      
            cookies.set('jwt', jwt.sign({ id, name }, JWT_SECRET), { path: '/' });
      
            return { success: true };
            // 👆 or, if we're using HTTP headers based auth, we could return the token,
            // and let the client set the header on subsequent requests
          } catch {
            return invalid(401, { error: 'Authentication failed' });
          }
    }),
}) */