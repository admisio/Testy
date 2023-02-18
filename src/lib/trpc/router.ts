import { t } from '$lib/trpc/t';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { testTemplates } from './routes/testTemplates';
import { groups } from './routes/groups';
import { assignedTests } from './routes/assignedTests';
import { submissions } from './routes/submissions';
import { auth } from './routes/auth';
import { users } from './routes/users';
import { feedback } from './routes/feedback';

export const router = t.router({
    tests: testTemplates,
    users,
    groups,
    assignedTests,
    submissions,
    feedback,
    auth
});

export type Router = typeof router;

// 👇 type helpers 💡
export type RouterInputs = inferRouterInputs<Router>;
export type RouterOutputs = inferRouterOutputs<Router>;
