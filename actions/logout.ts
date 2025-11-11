'use server';

import { signOut } from '@/lib/auth';

export const logout = async () => {
  //some server stuff

  await signOut({ redirectTo: '/login' });
};
