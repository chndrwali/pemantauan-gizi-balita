import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Mohon masukan email yang valid'),
  password: z.string().min(1, 'Password di butuhkan'),
});

export const registerSchema = z.object({
  nik: z.string().min(16, 'NIK harus terdiri dari 16 digit angka'),
  name: z.string().min(1, 'Nama harus diisi'),
  username: z.string().optional(),
  phone: z.string().min(11, 'Nomor Handphone minimal 11 digit angka'),
  address: z.string().min(1, 'Alamat dibutuhkan'),
  rt: z.string().min(1),
  rw: z.string().min(1),
  kelurahan: z.string().min(1),
  kecamatan: z.string().min(1),
  kodeWilayah: z.string().optional(),
  nomorSIP: z.string().optional(),
  email: z.email('Mohon masukan email yang valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  role: z.enum(['PUSKESMAS', 'KADER', 'PETUGAS', 'ORANGTUA']),
});

export const updateUserSchema = z.object({
  nik: z.string().min(16, 'NIK harus terdiri dari 16 digit angka'),
  name: z.string().min(1, 'Nama harus diisi'),
  username: z.string().optional(),
  phone: z.string().min(11, 'Nomor Handphone minimal 11 digit angka'),
  address: z.string().min(1, 'Alamat dibutuhkan'),
  rt: z.string().min(1),
  rw: z.string().min(1),
  kelurahan: z.string().min(1),
  kecamatan: z.string().min(1),
  kodeWilayah: z.string().optional(),
  nomorSIP: z.string().optional(),
  email: z.email('Mohon masukan email yang valid'),
  role: z.enum(['PUSKESMAS', 'KADER', 'PETUGAS', 'ORANGTUA']),
});

export const notificationSchema = z.object({
  userId: z.string().uuid(),
  title: z.string(),
  body: z.string(),
  type: z.string().default('GENERAL'),
});

export const sendToAllSchema = z.object({
  role: z.enum(['KADER', 'ORANGTUA']),
  title: z.string(),
  body: z.string(),
  type: z.string().default('BROADCAST'),
});
