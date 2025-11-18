import prisma from '@/lib/db';
import { baseProcedure, createTRPCRouter } from '@/trpc/init';
import z from 'zod';

export const orangTuaRouter = createTRPCRouter({
  getBalitaByOrangTuaId: baseProcedure.input(z.object({ id: z.string().uuid().optional() })).query(async ({ input }) => {
    const { id } = input;

    const data = await prisma.balita.findMany({
      where: { orangTuaId: id },
      select: {
        id: true,
        anakKe: true,
        bbLahirKg: true,
        jenisKelamin: true,
        nama: true,
        nikAnak: true,
        tanggalLahir: true,
        tbLahirCm: true,
        pengukuran: {
          select: {
            beratKg: true,
            catatan: true,
            lilaCm: true,
            lkCm: true,
            statusBBTB: true,
            statusBBU: true,
            statusTBU: true,
            tanggal: true,
            tinggiCm: true,
            zHFA: true,
            zWFA: true,
            zWFH: true,
          },
        },
      },
    });

    const mapped = data.map((d) => ({
      ...d,
      tanggalLahir: d.tanggalLahir.toISOString(),
      bbLahirKg: d.bbLahirKg ? Number(d.bbLahirKg.toString()) : undefined,
      tbLahirCm: d.tbLahirCm ? Number(d.tbLahirCm.toString()) : undefined,
      pengukuran: d.pengukuran.map((p) => ({
        ...p,
        tanggal: p.tanggal.toISOString(),
        beratKg: Number(p.beratKg.toString()),
        tinggiCm: Number(p.tinggiCm.toString()),
        lilaCm: p.lilaCm ? Number(p.lilaCm.toString()) : undefined,
        lkCm: p.lkCm ? Number(p.lkCm.toString()) : undefined,
        zWFA: p.zWFA ? Number(p.zWFA.toString()) : undefined,
        zHFA: p.zHFA ? Number(p.zHFA.toString()) : undefined,
        zWFH: p.zWFH ? Number(p.zWFH.toString()) : undefined,
      })),
    }));

    return mapped;
  }),
});
