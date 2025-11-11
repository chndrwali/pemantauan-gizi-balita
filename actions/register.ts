'use server';

import * as z from 'zod';
import { registerSchema } from '@/lib/form-schema';
import bcrypt from 'bcryptjs';
import { getUserByEmail, getUserByNIK } from '@/lib/data/user';
import prisma from '@/lib/db';

export const register = async (values: z.infer<typeof registerSchema>) => {
  const validatedFields = registerSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Validasi gagal. Periksa kembali email dan password Anda.' };
  }

  const { email, password, name, username, nik, address, kecamatan, kelurahan, phone, role, rt, rw, kodeWilayah, nomorSIP } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  const existingUser = await getUserByEmail(email);
  const existingNIK = await getUserByNIK(nik);

  if (existingNIK) {
    return { error: 'NIK Sudah terdaftar' };
  }

  if (existingUser) {
    return { error: 'Email sudah terdaftar!' };
  }

  await prisma.user.create({
    data: {
      email,
      name,
      address,
      kecamatan,
      kelurahan,
      kodeWilayah,
      nik,
      nomorSIP,
      phone,
      role,
      username,
      password: hashedPassword,
      rt,
      rw,
    },
  });

  return { success: 'Akun Berhasil dibuat' };
};
