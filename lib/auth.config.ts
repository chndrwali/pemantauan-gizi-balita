import bcrypt from 'bcryptjs';
import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { loginSchema } from '@/lib/form-schema';
import { getUserByEmail } from '@/lib/data/user';
// import Google from 'next-auth/providers/google';

export default {
  providers: [
    // Google({
    //   clientId: process.env.AUTH_GOOGLE_ID!,
    //   clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    // }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = loginSchema.safeParse(credentials);
        if (!validatedFields.success) {
          return null;
        }
        const { email, password } = validatedFields.data;

        const user = await getUserByEmail(email);

        if (!user || !user.password) return null;

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return null;

        return {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          image: user.image,
          emailVerified: user.emailVerified,
          role: user.role,
        };
      },
    }),
  ],
} satisfies NextAuthConfig;
