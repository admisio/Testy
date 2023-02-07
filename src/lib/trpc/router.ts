import { t } from '$lib/trpc/t';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { tests } from './routes/tests';
import { groups } from './routes/groups';
import { assignedTests } from './routes/assignedTests';
// import { candidates } from './routes/candidates';

export const router = t.router({
  tests,
  groups,
  assignedTests,
});

export type Router = typeof router;

// 👇 type helpers 💡
export type RouterInputs = inferRouterInputs<Router>;
export type RouterOutputs = inferRouterOutputs<Router>;
