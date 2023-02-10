import { t } from '$lib/trpc/t';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { testTemplates } from './routes/testTemplates';
import { groups } from './routes/groups';
import { assignedTests } from './routes/assignedTests';

export const router = t.router({
  tests: testTemplates,
  groups,
  assignedTests,
});

export type Router = typeof router;

// 👇 type helpers 💡
export type RouterInputs = inferRouterInputs<Router>;
export type RouterOutputs = inferRouterOutputs<Router>;
