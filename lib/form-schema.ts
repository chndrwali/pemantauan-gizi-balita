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

export const createBalitaSchema = z.object({
  orangTuaId: z.string().uuid(),
  nama: z.string().min(1),
  nikAnak: z.string().optional().nullable(),
  noKIA: z.string().optional().nullable(),
  tanggalLahir: z.preprocess((v) => (typeof v === 'string' ? new Date(v) : v), z.date()),
  jenisKelamin: z.enum(['L', 'P']),
  anakKe: z.number().int().optional().nullable(),
  bbLahirKg: z.number().optional().nullable(),
  tbLahirCm: z.number().optional().nullable(),
  alamat: z.string().optional().nullable(),
  kelurahan: z.string().optional().nullable(),
  kecamatan: z.string().optional().nullable(),
  aktif: z.boolean().optional().default(true),
});

export const addTimbangSimpleSchema = z.object({
  balitaId: z.string().uuid(),
  tanggal: z.preprocess((v) => (typeof v === 'string' ? new Date(v) : v), z.date()),
  beratKg: z.preprocess((v) => (v === null || v === undefined ? undefined : Number(v)), z.number().optional().nullable()),
  tinggiCm: z.preprocess((v) => (v === null || v === undefined ? undefined : Number(v)), z.number().optional().nullable()),
  lilaCm: z.preprocess((v) => (v === null || v === undefined ? undefined : Number(v)), z.number().optional().nullable()),
  lkCm: z.preprocess((v) => (v === null || v === undefined ? undefined : Number(v)), z.number().optional().nullable()),

  // optional reference for z-score calculation:
  // either provide lms.{wfa|hfa|wfh}.(L,M,S) OR meanSd.{wfa|hfa|wfh}.{mean,sd}
  lms: z
    .object({
      wfa: z.object({ L: z.number(), M: z.number(), S: z.number() }).optional(),
      hfa: z.object({ L: z.number(), M: z.number(), S: z.number() }).optional(),
      wfh: z.object({ L: z.number(), M: z.number(), S: z.number() }).optional(),
    })
    .optional(),
  meanSd: z
    .object({
      wfa: z.object({ mean: z.number(), sd: z.number() }).optional(),
      hfa: z.object({ mean: z.number(), sd: z.number() }).optional(),
      wfh: z.object({ mean: z.number(), sd: z.number() }).optional(),
    })
    .optional(),

  source: z.enum(['ORANGTUA', 'KADER', 'PETUGAS', 'PUSKESMAS']).optional().default('PUSKESMAS'),
  pencatatId: z.string().uuid().optional().nullable(),
  catatan: z.string().optional().nullable(),
});
