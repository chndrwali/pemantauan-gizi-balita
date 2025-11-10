import NextAuth from 'next-auth';
import authConfig from '@/lib/auth.config';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '@/lib/db';
import { getUserById } from './data/user';
import { Role } from '@/lib/generated/prisma/client';

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: '/sign-in',
    error: '/error',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'credentials') return true;
      const existingUser = await getUserById(user.id!);

      if (!existingUser) {
        return false;
      }
      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as (typeof Role)[keyof typeof Role];
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      token.role = existingUser.role;

      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt', maxAge: 60 * 60, updateAge: 15 * 60 },
  ...authConfig,
});
