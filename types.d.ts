import { Role, User } from '@/lib/generated/prisma/client';
import { type DefaultSession } from 'next-auth';

export type SafeUser = Omit<User, 'createdAt' | 'updatedAt' | 'emailVerified'> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
  role?: Role;
};

export type ExtendedUser = DefaultSession['user'] & {
  role: Role;
};

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser;
  }
}
