/* import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { Router } from '@testy/trpc/server/router';
const trpc = createTRPCProxyClient<Router>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/trpc',
    }),
  ],
});

export default trpc; */

import {router} from '@testy/trpc/server/router';

const trpc = router.createCaller({userId: '1', role: 'admin'});

export default trpc;