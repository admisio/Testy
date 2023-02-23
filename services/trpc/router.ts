import { t } from './t';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { templates } from './routes/templates';
import { groups } from './routes/groups';
import { assignments } from './routes/assignments';
import { submissions } from './routes/submissions';
import { auth } from './routes/auth';
import { users } from './routes/users';
import { feedback } from './routes/feedback';

export const router = t.router({
    templates,
    users,
    groups,
    assignments,
    submissions,
    feedback,
    auth
});

export type Router = typeof router;

// 👇 type helpers 💡
export type RouterInputs = inferRouterInputs<Router>;
export type RouterOutputs = inferRouterOutputs<Router>;
