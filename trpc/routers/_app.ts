import { createTRPCRouter } from '../init';
import { usersAdminRouter } from '@/lib/server/puskesmas/users-procedures';

export const appRouter = createTRPCRouter({
  usersAdmin: usersAdminRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
