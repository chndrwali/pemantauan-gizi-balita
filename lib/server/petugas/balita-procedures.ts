import prisma from '@/lib/db';
import { addTimbangSimpleSchema, createBalitaSchema } from '@/lib/form-schema';
import { Prisma } from '@/lib/generated/prisma/client';
import { classifyByZ, computeZFromLMS, computeZSimple } from '@/lib/utils';
import { baseProcedure, createTRPCRouter } from '@/trpc/init';
import { Decimal } from '@prisma/client/runtime/library';
import z from 'zod';

export const balitaRouter = createTRPCRouter({
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

    return {
      items,
      page,
      limit,
      total,
      pageCount: Math.ceil(total / limit),
    };
  }),
});
