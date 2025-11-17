import prisma from '@/lib/db';
import { addTimbangSimpleSchema, createBalitaSchema } from '@/lib/form-schema';
import { Prisma } from '@/lib/generated/prisma/client';
import { classifyByZ, computeZFromLMS, computeZSimple } from '@/lib/utils';
import { baseProcedure, createTRPCRouter } from '@/trpc/init';
import { Decimal } from '@prisma/client/runtime/library';
import z from 'zod';

export const balitaRouter = createTRPCRouter({
  getById: baseProcedure.input(z.object({ id: z.string().uuid() })).query(async ({ input }) => {
    const { id } = input;

    const balita = await prisma.balita.findUnique({
      where: { id },
      select: {
        aktif: true,
        alamat: true,
        anakKe: true,
        bbLahirKg: true,
        id: true,
        jenisKelamin: true,
        kecamatan: true,
        kelurahan: true,
        nama: true,
        nikAnak: true,
        noKIA: true,
        tanggalLahir: true,
        tbLahirCm: true,
        pengukuran: {
          take: 1,
          orderBy: { tanggal: 'desc' },
        },
        orangTua: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
    });

    if (!balita) return null;

    // helper: safe convert Decimal -> number | undefined
    const decimalToNumber = (d: Prisma.Decimal | null | undefined): number | undefined => {
      if (d === null || d === undefined) return undefined;
      // Prisma Decimal has toString() / toNumber(); using toString -> Number for safety
      try {
        const s = typeof d === 'object' && typeof d.toString === 'function' ? d.toString() : String(d);
        const n = Number(s);
        return Number.isFinite(n) ? n : undefined;
      } catch {
        return undefined;
      }
    };

    const latest = balita.pengukuran && balita.pengukuran.length > 0 ? balita.pengukuran[0] : null;

    const mapped = {
      id: balita.id,
      nama: balita.nama,
      nikAnak: balita.nikAnak ?? null,
      noKIA: balita.noKIA ?? null,
      tanggalLahir: balita.tanggalLahir ? balita.tanggalLahir.toISOString() : null,
      jenisKelamin: balita.jenisKelamin,
      anakKe: balita.anakKe ?? null,
      bbLahirKg: decimalToNumber(balita.bbLahirKg),
      tbLahirCm: decimalToNumber(balita.tbLahirCm),
      alamat: balita.alamat ?? null,
      kelurahan: balita.kelurahan ?? null,
      kecamatan: balita.kecamatan ?? null,
      aktif: balita.aktif,
      orangTua: balita.orangTua ?? null,
      pengukuranTerbaru: latest
        ? {
            id: latest.id,
            tanggal: latest.tanggal ? latest.tanggal.toISOString() : null,
            beratKg: decimalToNumber(latest.beratKg),
            tinggiCm: decimalToNumber(latest.tinggiCm),
            lilaCm: decimalToNumber(latest.lilaCm),
            lkCm: decimalToNumber(latest.lkCm),
            zWFA: decimalToNumber(latest.zWFA),
            zHFA: decimalToNumber(latest.zHFA),
            zWFH: decimalToNumber(latest.zWFH),
            statusBBU: latest.statusBBU ?? null,
            statusTBU: latest.statusTBU ?? null,
            statusBBTB: latest.statusBBTB ?? null,
          }
        : null,
    };

    return mapped;
  }),
  createBalita: baseProcedure.input(createBalitaSchema).mutation(async ({ input }) => {
    const payload = {
      orangTuaId: input.orangTuaId,
      nama: input.nama,
      nikAnak: input.nikAnak ?? undefined,
      noKIA: input.noKIA ?? undefined,
      tanggalLahir: input.tanggalLahir,
      jenisKelamin: input.jenisKelamin,
      anakKe: input.anakKe ?? undefined,
      bbLahirKg: input.bbLahirKg ?? undefined,
      tbLahirCm: input.tbLahirCm ?? undefined,
      alamat: input.alamat ?? undefined,
      kelurahan: input.kelurahan ?? undefined,
      kecamatan: input.kecamatan ?? undefined,
      aktif: !!input.aktif,
    };

    const created = await prisma.balita.create({ data: payload });
    return { success: true, balita: created };
  }),
  addTimbang: baseProcedure.input(addTimbangSimpleSchema).mutation(async ({ input }) => {
    const { balitaId, tanggal, beratKg, tinggiCm, lilaCm, lkCm, source, pencatatId, lms, meanSd, catatan } = input;

    if ((beratKg === null || beratKg === undefined) && (tinggiCm === null || tinggiCm === undefined)) {
      throw new Error('Minimal salah satu dari beratKg atau tinggiCm harus diisi');
    }

    // compute z-scores with priority: LMS -> meanSd -> null
    let zWFA: number | null = null;
    let zHFA: number | null = null;
    let zWFH: number | null = null;

    // WFA
    if (lms?.wfa && typeof beratKg === 'number') {
      const { L, M, S } = lms.wfa;
      const z = computeZFromLMS(L, M, S, Number(beratKg));
      zWFA = Number.isFinite(z) ? z : null;
    } else if (meanSd?.wfa && typeof beratKg === 'number') {
      const { mean, sd } = meanSd.wfa;
      const z = computeZSimple(mean, sd, Number(beratKg));
      zWFA = Number.isFinite(z) ? z : null;
    }

    // HFA
    if (lms?.hfa && typeof tinggiCm === 'number') {
      const { L, M, S } = lms.hfa;
      const z = computeZFromLMS(L, M, S, Number(tinggiCm));
      zHFA = Number.isFinite(z) ? z : null;
    } else if (meanSd?.hfa && typeof tinggiCm === 'number') {
      const { mean, sd } = meanSd.hfa;
      const z = computeZSimple(mean, sd, Number(tinggiCm));
      zHFA = Number.isFinite(z) ? z : null;
    }

    // WFH (weight-for-height) - client must supply appropriate reference for height
    if (lms?.wfh && typeof beratKg === 'number') {
      const { L, M, S } = lms.wfh;
      const z = computeZFromLMS(L, M, S, Number(beratKg));
      zWFH = Number.isFinite(z) ? z : null;
    } else if (meanSd?.wfh && typeof beratKg === 'number') {
      const { mean, sd } = meanSd.wfh;
      const z = computeZSimple(mean, sd, Number(beratKg));
      zWFH = Number.isFinite(z) ? z : null;
    }

    const statusBBU = zWFA !== null ? classifyByZ(zWFA, 'WFA') : null;
    const statusTBU = zHFA !== null ? classifyByZ(zHFA, 'HFA') : null;
    const statusBBTB = zWFH !== null ? classifyByZ(zWFH, 'WFH') : null;

    const created = await prisma.timbang.create({
      data: {
        balitaId,
        tanggal,
        beratKg: typeof beratKg === 'number' ? new Decimal(beratKg) : new Decimal(0),
        tinggiCm: typeof tinggiCm === 'number' ? new Decimal(tinggiCm) : new Decimal(0),
        lilaCm: lilaCm ?? undefined,
        lkCm: lkCm ?? undefined,
        source,
        pencatatId: pencatatId ?? undefined,
        zWFA: zWFA ?? undefined,
        zHFA: zHFA ?? undefined,
        zWFH: zWFH ?? undefined,
        statusBBU: statusBBU ?? undefined,
        statusTBU: statusTBU ?? undefined,
        statusBBTB: statusBBTB ?? undefined,
        catatan: catatan ?? undefined,
      },
    });

    return {
      success: true,
      timbang: created,
      computed: { zWFA, zHFA, zWFH, statusBBU, statusTBU, statusBBTB },
    };
  }),
  getManyBalita: baseProcedure.input(z.object({ page: z.number().min(1).default(1), limit: z.number().min(1).max(100), search: z.string().optional() })).query(async ({ input }) => {
    const { limit, page, search } = input;
    const skip = (page - 1) * limit;

    const where: Prisma.BalitaWhereInput = {};

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [{ nama: { contains: q, mode: 'insensitive' } }, { nikAnak: { contains: q, mode: 'insensitive' } }, { noKIA: { contains: q, mode: 'insensitive' } }];
    }

    const [items, total] = await Promise.all([
      prisma.balita.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        where,
        select: {
          id: true,
          nama: true,
          nikAnak: true,
          noKIA: true,
          tanggalLahir: true,
          jenisKelamin: true,
          aktif: true,
          orangTuaId: true,
          alamat: true,
          bbLahirKg: true,
          tbLahirCm: true,
          kecamatan: true,
          kelurahan: true,

          orangTua: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },

          // ⬅️ ambil 1 pengukuran terbaru
          pengukuran: {
            take: 1,
            orderBy: { tanggal: 'desc' },
            select: {
              id: true,
              tanggal: true,
              beratKg: true,
              tinggiCm: true,
              statusBBTB: true,
              statusBBU: true,
              statusTBU: true,
            },
          },
        },
      }),

      prisma.balita.count({ where }),
    ]);

    const mapped = items.map((b) => {
      const latest = b.pengukuran && b.pengukuran.length > 0 ? b.pengukuran[0] : null;

      return {
        ...b,
        bbLahirKg: b.bbLahirKg ? Number(b.bbLahirKg.toString()) : undefined,
        tbLahirCm: b.tbLahirCm ? Number(b.tbLahirCm.toString()) : undefined,
        tanggalLahir: b.tanggalLahir ? b.tanggalLahir.toISOString() : undefined,
        pengukuran: latest
          ? {
              id: latest.id,
              tanggal: latest.tanggal ? latest.tanggal.toISOString() : null,
              beratKg: latest.beratKg ? Number(latest.beratKg.toString()) : undefined,
              tinggiCm: latest.tinggiCm ? Number(latest.tinggiCm.toString()) : undefined,
              statusBBTB: latest.statusBBTB,
              statusBBU: latest.statusBBU,
              statusTBU: latest.statusTBU,
            }
          : null,
      };
    });

    return {
      items: mapped,
      page,
      limit,
      total,
      pageCount: Math.ceil(total / limit),
    };
  }),
  getOrangTua: baseProcedure.input(z.object({ role: z.enum(['ORANGTUA', 'KADER']) })).query(async ({ input }) => {
    const { role } = input;

    const where: Prisma.UserWhereInput = {
      role: role ? { equals: role } : { in: ['ORANGTUA'] },
    };

    const items = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        role: true,
        email: true,
      },
      orderBy: [{ createdAt: 'desc' }],
    });

    return items;
  }),
});
