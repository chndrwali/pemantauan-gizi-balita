'use client';

import { Baby, Eye, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Role, User } from '@/lib/generated/prisma/client';
import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';
import { DetailBalitaModal } from '../../petugas/sections/balita/detail-balita-modal';
import { useState } from 'react';

interface Props {
  user: (User & { role: Role }) | null;
}

export const OrangTuaAnakSection = ({ user }: Props) => {
  const trpc = useTRPC();
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const { data: balita, isLoading } = useQuery(trpc.orangtua.getBalitaByOrangTuaId.queryOptions({ id: user?.id }));

  // Helper function untuk status gizi
  const getNutritionStatus = (status: string | null | undefined) => {
    switch (status) {
      case 'GIZI_BURUK':
        return { label: 'Gizi Buruk', color: 'bg-red-100 text-red-800 border-red-200' };
      case 'GIZI_KURANG':
        return { label: 'Gizi Kurang', color: 'bg-orange-100 text-orange-800 border-orange-200' };
      case 'GIZI_BAIK':
        return { label: 'Gizi Baik', color: 'bg-green-100 text-green-800 border-green-200' };
      case 'GIZI_LEBIH':
        return { label: 'Gizi Lebih', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
      case 'RISIKO_GEMUK':
        return { label: 'Risiko Gemuk', color: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 'OBESE':
        return { label: 'Obesitas', color: 'bg-red-100 text-red-800 border-red-200' };
      case 'NORMAL_TB_U':
        return { label: 'Tinggi Normal', color: 'bg-green-100 text-green-800 border-green-200' };
      case 'STUNTED':
        return { label: 'Stunted', color: 'bg-orange-100 text-orange-800 border-orange-200' };
      case 'SEVERELY_STUNTED':
        return { label: 'Stunted Berat', color: 'bg-red-100 text-red-800 border-red-200' };
      default:
        return { label: 'Belum Diukur', color: 'bg-gray-100 text-gray-800 border-gray-200' };
    }
  };

  const calculateAge = (tanggalLahir: string) => {
    const birthDate = new Date(tanggalLahir);
    const today = new Date();
    let months = (today.getFullYear() - birthDate.getFullYear()) * 12;
    months -= birthDate.getMonth();
    months += today.getMonth();

    if (months < 12) {
      return `${months} bulan`;
    } else {
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      return `${years} tahun${remainingMonths > 0 ? ` ${remainingMonths} bulan` : ''}`;
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getLatestMeasurement = (pengukuran: any[]) => {
    if (!pengukuran || pengukuran.length === 0) return null;
    return pengukuran[pengukuran.length - 1];
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Baby className="h-8 w-8 text-blue-600" />
            Data Anak
          </h1>
          <p className="text-slate-600 mt-2">Kelola data dan pantau perkembangan anak Anda</p>
        </div>
      </div>

      {/* Search and Filter */}
      {/* <Card className="p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input placeholder="Cari nama anak..." className="pl-10 h-12 text-base" />
          </div>
          <Button variant="outline" className="h-12 px-4">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </Card> */}

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center bg-blue-50 border-blue-200">
          <div className="text-2xl font-bold text-blue-900">{balita?.length || 0}</div>
          <div className="text-sm text-blue-700">Total Anak</div>
        </Card>
        <Card className="p-4 text-center bg-green-50 border-green-200">
          <div className="text-2xl font-bold text-green-900">{balita?.filter((a) => getLatestMeasurement(a.pengukuran)?.statusBBTB === 'GIZI_BAIK').length || 0}</div>
          <div className="text-sm text-green-700">Gizi Baik</div>
        </Card>
        <Card className="p-4 text-center bg-orange-50 border-orange-200">
          <div className="text-2xl font-bold text-orange-900">
            {balita?.filter((a) => {
              const status = getLatestMeasurement(a.pengukuran)?.statusBBTB;
              return status === 'GIZI_KURANG' || status === 'STUNTED';
            }).length || 0}
          </div>
          <div className="text-sm text-orange-700">Perlu Perhatian</div>
        </Card>
        <Card className="p-4 text-center bg-red-50 border-red-200">
          <div className="text-2xl font-bold text-red-900">
            {balita?.filter((a) => {
              const status = getLatestMeasurement(a.pengukuran)?.statusBBTB;
              return status === 'GIZI_BURUK' || status === 'SEVERELY_STUNTED' || status === 'OBESE';
            }).length || 0}
          </div>
          <div className="text-sm text-red-700">Butuh Penanganan</div>
        </Card>
      </div>

      {/* Anak List */}
      <Card className="p-6 shadow-sm">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-pulse text-lg">Memuat data anak...</div>
          </div>
        ) : balita && balita.length > 0 ? (
          <div className="space-y-4">
            {balita.map((anak) => {
              const latestUkur = getLatestMeasurement(anak.pengukuran);
              const status = getNutritionStatus(latestUkur?.statusBBTB);
              const usia = calculateAge(anak.tanggalLahir);

              return (
                <div key={anak.id} className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Info Anak */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                        <h3 className="text-xl font-semibold text-slate-900">{anak.nama}</h3>
                        <Badge className={status.color}>{status.label}</Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <Baby className="h-4 w-4 text-slate-400" />
                          <span>{anak.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span>Usia: {usia}</span>
                        </div>
                        <div>Anak ke: {anak.anakKe || '-'}</div>
                        <div>Lahir: {new Date(anak.tanggalLahir).toLocaleDateString('id-ID')}</div>
                      </div>

                      {/* Data Pengukuran Terbaru */}
                      {latestUkur && (
                        <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                          <div className="text-sm font-medium text-slate-700 mb-2">Pengukuran Terakhir:</div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-slate-600">Berat: </span>
                              <strong>{latestUkur.beratKg} kg</strong>
                            </div>
                            <div>
                              <span className="text-slate-600">Tinggi: </span>
                              <strong>{latestUkur.tinggiCm} cm</strong>
                            </div>
                            <div>
                              <span className="text-slate-600">Tanggal: </span>
                              <strong>{new Date(latestUkur.tanggal).toLocaleDateString('id-ID')}</strong>
                            </div>
                            <div>
                              <span className="text-slate-600">Catatan: </span>
                              <span className={latestUkur.catatan ? 'text-slate-900' : 'text-slate-400'}>{latestUkur.catatan || 'Tidak ada'}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                      <Button variant="outline" className="w-full h-10" onClick={() => setIsDetailOpen(true)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Detail
                      </Button>
                      <DetailBalitaModal id={anak.id} onOpenChange={setIsDetailOpen} open={isDetailOpen} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg">
            <Baby className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Belum ada data anak</h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">Hubungi Petugas kesehatan atau kader untuk menambahkan data anak Anda untuk mulai memantau perkembangan dan status gizi mereka.</p>
          </div>
        )}
      </Card>

      {/* Informasi Penting */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <Baby className="h-5 w-5" />
          Informasi Penting
        </h3>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>• Pastikan data anak selalu diperbarui sesuai dengan kondisi terbaru</li>
          <li>• Lakukan pengukuran berat dan tinggi badan secara berkala di posyandu</li>
          <li>• Konsultasikan dengan tenaga kesehatan jika ada perubahan status gizi</li>
          <li>• Catat perkembangan anak untuk memantau pertumbuhan yang optimal</li>
        </ul>
      </Card>
    </div>
  );
};
