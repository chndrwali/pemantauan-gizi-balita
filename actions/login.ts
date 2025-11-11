'use server';

import * as z from 'zod';
import { loginSchema } from '@/lib/form-schema';
import { signIn } from '@/lib/auth';
import { AuthError } from 'next-auth';
import { getUserByEmail } from '@/lib/data/user';
import { redirectMap } from '@/lib/utils';

export const login = async (values: z.infer<typeof loginSchema>) => {
  const validatedFields = loginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Validasi gagal.' };
  }

  const { email, password } = validatedFields.data;

  const user = await getUserByEmail(email);

  if (!user || !user.email || !user.password) {
    return { error: 'Email atau password salah!' };
  }

  try {
    const redirectTo = redirectMap[user.role] ?? '/';

    await signIn('credentials', {
      email,
      password,
      redirectTo,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Validasi gagal. Periksa kembali email dan password Anda.' };
        default:
          return { error: 'Ada sesuatu yang salah!' };
      }
    }
    throw error;
  }

  return { success: 'Login Berhasil!' };
};
