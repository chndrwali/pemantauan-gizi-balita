import prisma from '@/lib/db';
import { Prisma } from '@/lib/generated/prisma/client';
import { baseProcedure, createTRPCRouter } from '@/trpc/init';
import { TRPCError } from '@trpc/server';
import z from 'zod';

export const usersAdminRouter = createTRPCRouter({
  getByID: baseProcedure.input(z.object({ id: z.string().uuid() })).query(async ({ input }) => {
    const { id } = input;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        nik: true,
        name: true,
        email: true,
        username: true,
        phone: true,
        address: true,
        rt: true,
        rw: true,
        kelurahan: true,
        kecamatan: true,
        kodeWilayah: true,
        nomorSIP: true,
        role: true,
      },
    });

    return { success: true, user };
  }),
  bulkDelete: baseProcedure
    .input(
      z.object({
        ids: z.array(z.string().uuid()).min(1, 'Pilih minimal 1 data'),
      })
    )
    .mutation(async ({ input }) => {
      const { ids } = input;

      const result = await prisma.$transaction(async (tx) => {
        const existing = await tx.user.findMany({
          where: { id: { in: ids } },
          select: { id: true },
        });

        const del = await tx.user.deleteMany({
          where: { id: { in: ids } },
        });

        return {
          deletedCount: del.count,
          deletedIds: existing.map((x) => x.id),
        };
      });

      const notDeletedCount = ids.length - result.deletedCount;

      return {
        success: true,
        deletedCount: result.deletedCount,
        notDeletedCount,
        deletedIds: result.deletedIds,
      };
    }),
  getMany: baseProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100),
        role: z.enum(['KADER', 'PETUGAS', 'ORANGTUA']).optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const { page, limit, role, search } = input;
      const skip = (page - 1) * limit;

      const where: Prisma.UserWhereInput = {
        // filter role: kalau role dipilih → equals; kalau tidak → exclude PUSKESMAS
        role: role ? { equals: role } : { in: ['KADER', 'PETUGAS', 'ORANGTUA'] },
      };

      if (search && search.trim()) {
        const q = search.trim();
        where.OR = [
          { name: { contains: q, mode: Prisma.QueryMode.insensitive } },
          { email: { contains: q, mode: Prisma.QueryMode.insensitive } },
          { username: { contains: q, mode: Prisma.QueryMode.insensitive } },
        ] satisfies Prisma.UserWhereInput[]; // ⬅️ kunci: pastikan tipenya tepat
      }

      const [items, total] = await Promise.all([
        prisma.user.findMany({
          skip,
          take: limit,
          orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
          where,
          select: {
            id: true,
            nik: true,
            name: true,
            email: true,
            username: true,
            emailVerified: true,
            phone: true,
            address: true,
            rt: true,
            rw: true,
            kelurahan: true,
            kecamatan: true,
            kodeWilayah: true,
            nomorSIP: true,
            image: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
        }),
        prisma.user.count({ where }),
      ]);

      return {
        items,
        page,
        limit,
        total,
        pageCount: Math.ceil(total / limit),
      };
    }),
  updateUser: baseProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        nik: z.string().min(16, 'NIK harus terdiri dari 16 digit angka').optional(),
        name: z.string().min(1, 'Nama harus diisi').optional(),
        username: z.string().optional(),
        phone: z.string().min(11, 'Nomor Handphone minimal 11 digit angka').optional(),
        address: z.string().min(1, 'Alamat dibutuhkan').optional(),
        rt: z.string().min(1).optional(),
        rw: z.string().min(1).optional(),
        kelurahan: z.string().min(1).optional(),
        kecamatan: z.string().min(1).optional(),
        kodeWilayah: z.string().optional(),
        nomorSIP: z.string().optional(),
        email: z.email('Mohon masukan email yang valid').optional(),
        role: z.enum(['KADER', 'PETUGAS', 'ORANGTUA']).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...payload } = input;

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: Record<string, any> = {};
        for (const [k, v] of Object.entries(payload)) {
          if (typeof v !== 'undefined') data[k] = v === null ? null : v;
        }

        const updated = await prisma.user.update({
          where: { id },
          data,
          select: {
            id: true,
            name: true,
            email: true,
            username: true,
            phone: true,
            address: true,
            rt: true,
            rw: true,
            kelurahan: true,
            kecamatan: true,
            kodeWilayah: true,
            nomorSIP: true,
            role: true,
            updatedAt: true,
          },
        });

        return { success: true, user: updated };
      } catch (error) {
        console.error('users.update error', error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Gagal memperbarui pengguna' });
      }
    }),
});
