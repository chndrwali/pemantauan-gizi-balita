import prisma from '@/lib/db';
import { Prisma } from '@/lib/generated/prisma/client';
import { baseProcedure, createTRPCRouter } from '@/trpc/init';
import z from 'zod';

export const usersAdminRouter = createTRPCRouter({
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
});
