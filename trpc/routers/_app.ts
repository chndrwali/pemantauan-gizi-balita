import { usersPetugasRouter } from '@/lib/server/petugas/user-procedures';
import { createTRPCRouter } from '../init';
import { usersAdminRouter } from '@/lib/server/puskesmas/users-procedures';

export const appRouter = createTRPCRouter({
  usersAdmin: usersAdminRouter,
  usersPetugas: usersPetugasRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
