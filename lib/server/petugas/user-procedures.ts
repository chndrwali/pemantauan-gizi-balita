import prisma from '@/lib/db';
import { notificationSchema, sendToAllSchema } from '@/lib/form-schema';
import { Prisma } from '@/lib/generated/prisma/client';
import { baseProcedure, createTRPCRouter } from '@/trpc/init';
import z from 'zod';

export const usersPetugasRouter = createTRPCRouter({
  getCounts: baseProcedure.query(async () => {
    const [usersTotal, usersByRoleRaw, posyanduTotal, balitaTotal, timbangTotal, eventTotal, kunjunganTotal, monthlyStatsTotal, notificationTotal] = await Promise.all([
      // total users
      prisma.user.count(),
      // users grouped by role (raw query -> array of { role, count })
      prisma.$queryRawUnsafe(`SELECT role, COUNT(1) as count FROM "user" GROUP BY role;`) as Promise<Array<{ role: string; count: string }>>,
      // posyandu
      prisma.posyandu.count(),
      // balita
      prisma.balita.count(),
      // timbang
      prisma.timbang.count(),
      // events
      prisma.event.count(),
      // balita_kunjungan
      prisma.balitaKunjungan.count(),
      // monthly stats cache
      prisma.monthlyStats.count(),
      // notifications
      prisma.notification.count(),
      // device tokens
    ]);

    // transform usersByRoleRaw -> object { PUSKESMAS: number, KADER: number, ... }
    const usersByRole: Record<string, number> = {};
    (usersByRoleRaw || []).forEach((r) => {
      usersByRole[r.role] = Number(r.count);
    });

    return {
      success: true,
      totals: {
        usersTotal,
        usersByRole,
        posyanduTotal,
        balitaTotal,
        timbangTotal,
        eventTotal,
        kunjunganTotal,
        monthlyStatsTotal,
        notificationTotal,
      },
    };
  }),

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
  getUsersByRole: baseProcedure.input(z.object({ role: z.enum(['KADER', 'ORANGTUA']) })).query(async ({ input }) => {
    const users = await prisma.user.findMany({
      where: { role: input.role },
      select: { id: true, name: true, email: true },
      orderBy: { name: 'asc' },
    });

    return { success: true, users };
  }),
  sendNotification: baseProcedure.input(notificationSchema).mutation(async ({ input }) => {
    await prisma.notification.create({
      data: {
        userId: input.userId,
        title: input.title,
        body: input.body,
        type: input.type,
        status: 'SENT',
        sentAt: new Date(),
      },
    });

    return { success: true };
  }),
  sendToAll: baseProcedure.input(sendToAllSchema).mutation(async ({ input }) => {
    const { role, title, body, type } = input;

    const users = await prisma.user.findMany({
      where: { role },
      select: { id: true },
    });

    if (!users.length) return { success: true, count: 0 };

    await prisma.notification.createMany({
      data: users.map((u) => ({
        userId: u.id,
        title,
        body,
        type,
        status: 'SENT',
        sentAt: new Date(),
      })),
    });

    return { success: true, count: users.length };
  }),
  getNotificationMany: baseProcedure.input(z.object({ page: z.number().min(1).default(1), limit: z.number().min(1).max(100) })).query(async ({ input }) => {
    const { limit, page } = input;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.notification.findMany({
        skip,
        take: limit,
        orderBy: [{ createdAt: 'desc' }],
      }),
      prisma.notification.count(),
    ]);

    return { items, page, limit, pageCount: Math.ceil(total / limit), total };
  }),
});
