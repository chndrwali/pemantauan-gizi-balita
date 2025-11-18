'use client';

import Link from 'next/link';
import { Users, FileText, MessageSquare, DownloadCloud, Baby, TrendingUp, AlertTriangle, Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Role, User } from '@/lib/generated/prisma/client';
import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';

interface Props {
  user: (User & { role: Role }) | null;
}

// Define proper types untuk status
type NutritionStatus = 'GIZI_BURUK' | 'GIZI_KURANG' | 'GIZI_BAIK' | 'GIZI_LEBIH' | 'RISIKO_GEMUK' | 'OBESE' | 'OBESITAS' | 'NORMAL_TB_U' | 'STUNTED' | 'SEVERELY_STUNTED' | null;

interface StatusInfo {
  label: string;
  color: string;
  severity: 'high' | 'medium' | 'warning' | 'good' | 'neutral';
}

interface MeasurementStatus {
  statusBBTB: NutritionStatus;
  statusBBU: NutritionStatus;
  statusTBU: NutritionStatus;
}

export const OrangTuaSections = ({ user }: Props) => {
  const trpc = useTRPC();
  const { data: balita, isLoading } = useQuery(trpc.orangtua.getBalitaByOrangTuaId.queryOptions({ id: user?.id }));

  const initials = (user?.name || user?.email || 'U')
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // Updated helper function dengan status baru
  const getNutritionStatus = (status: NutritionStatus): StatusInfo => {
    switch (status) {
      // Status Gizi Berdasarkan BB/U (Berat Badan menurut Umur)
      case 'GIZI_BURUK':
        return { label: 'Gizi Buruk', color: 'bg-red-100 text-red-800 border-red-200', severity: 'high' };
      case 'GIZI_KURANG':
        return { label: 'Gizi Kurang', color: 'bg-orange-100 text-orange-800 border-orange-200', severity: 'medium' };
      case 'GIZI_BAIK':
        return { label: 'Gizi Baik', color: 'bg-green-100 text-green-800 border-green-200', severity: 'good' };
      case 'GIZI_LEBIH':
        return { label: 'Gizi Lebih', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', severity: 'warning' };
      case 'RISIKO_GEMUK':
        return { label: 'Risiko Gemuk', color: 'bg-amber-100 text-amber-800 border-amber-200', severity: 'warning' };
      case 'OBESE':
        return { label: 'Obesitas', color: 'bg-red-100 text-red-800 border-red-200', severity: 'high' };

      // Status Gizi Berdasarkan TB/U (Tinggi Badan menurut Umur)
      case 'NORMAL_TB_U':
        return { label: 'Tinggi Normal', color: 'bg-green-100 text-green-800 border-green-200', severity: 'good' };
      case 'STUNTED':
        return { label: 'Stunted', color: 'bg-orange-100 text-orange-800 border-orange-200', severity: 'medium' };
      case 'SEVERELY_STUNTED':
        return { label: 'Stunted Berat', color: 'bg-red-100 text-red-800 border-red-200', severity: 'high' };

      default:
        return { label: 'Belum Diukur', color: 'bg-gray-100 text-gray-800 border-gray-200', severity: 'neutral' };
    }
  };

  const getStatusIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="h-3 w-3" />;
      case 'medium':
        return <AlertTriangle className="h-3 w-3" />;
      case 'warning':
        return <AlertTriangle className="h-3 w-3" />;
      case 'good':
        return <Heart className="h-3 w-3" />;
      default:
        return <TrendingUp className="h-3 w-3" />;
    }
  };

  // Helper functions untuk data yang sering digunakan
  const getLatestMeasurement = (balitaData: typeof balita) => {
    if (!balitaData || balitaData.length === 0) return null;
    const latestBalita = balitaData[0];
    if (!latestBalita.pengukuran || latestBalita.pengukuran.length === 0) return null;
    return latestBalita.pengukuran[latestBalita.pengukuran.length - 1];
  };

  const getOverallStatus = (balitaData: typeof balita): StatusInfo => {
    if (!balitaData || balitaData.length === 0) {
      return getNutritionStatus(null);
    }

    // Ambil status dari semua anak, prioritaskan yang paling membutuhkan perhatian
    const allStatuses: MeasurementStatus[] = balitaData
      .map((anak) => {
        const latestUkur = anak.pengukuran && anak.pengukuran.length > 0 ? anak.pengukuran[anak.pengukuran.length - 1] : null;

        if (!latestUkur) return null;

        return {
          statusBBTB: latestUkur.statusBBTB as NutritionStatus,
          statusBBU: latestUkur.statusBBU as NutritionStatus,
          statusTBU: latestUkur.statusTBU as NutritionStatus,
        };
      })
      .filter((s): s is MeasurementStatus => s !== null);

    if (allStatuses.length === 0) {
      return getNutritionStatus(null);
    }

    // Prioritaskan status yang paling memerlukan perhatian
    const priorityOrder: NutritionStatus[] = ['SEVERELY_STUNTED', 'GIZI_BURUK', 'OBESITAS', 'OBESE', 'STUNTED', 'GIZI_KURANG', 'RISIKO_GEMUK', 'GIZI_LEBIH', 'NORMAL_TB_U', 'GIZI_BAIK'];

    for (const status of priorityOrder) {
      const found = allStatuses.find((s) => s.statusBBTB === status || s.statusBBU === status || s.statusTBU === status);
      if (found) {
        return getNutritionStatus(status);
      }
    }

    return getNutritionStatus(null);
  };

  const latestMeasurement = getLatestMeasurement(balita);
  const overallStatus = getOverallStatus(balita);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header dengan greeting */}
      <div className="text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Selamat Datang, {user?.name?.split(' ')[0] || 'Orang Tua'}!</h1>
        <p className="text-slate-600 mt-2">Pantau perkembangan anak Anda dengan mudah</p>
      </div>

      {/* Main grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* LEFT: Profile & Quick Actions */}
        <section className="col-span-1 lg:col-span-1">
          <Card className="p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-20 w-20 border-2 border-blue-100">
                {user?.image ? <AvatarImage src={user.image} alt={user?.name ?? 'avatar'} /> : <AvatarFallback className="text-lg bg-blue-50 text-blue-600">{initials}</AvatarFallback>}
              </Avatar>

              <div className="flex-1">
                <div className="text-xl font-bold text-slate-900">{user?.name ?? 'Orang Tua'}</div>
                <div className="text-sm text-slate-500 mt-1">{user?.email ?? ''}</div>
                <div className="flex items-center gap-2 mt-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-slate-600">{balita?.length || 0} Anak Terdaftar</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-100">
                <Baby className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="text-xs text-blue-600 font-medium">Jumlah Anak</div>
                <div className="text-xl font-bold text-blue-900 mt-1">{balita?.length || 0}</div>
              </div>

              <div
                className={`p-4 rounded-lg text-center border ${
                  overallStatus.severity === 'high'
                    ? 'bg-red-50 border-red-200'
                    : overallStatus.severity === 'medium'
                    ? 'bg-orange-50 border-orange-200'
                    : overallStatus.severity === 'warning'
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-green-50 border-green-200'
                }`}
              >
                <TrendingUp
                  className={`h-6 w-6 mx-auto mb-2 ${
                    overallStatus.severity === 'high' ? 'text-red-600' : overallStatus.severity === 'medium' ? 'text-orange-600' : overallStatus.severity === 'warning' ? 'text-yellow-600' : 'text-green-600'
                  }`}
                />
                <div className="text-xs font-medium">Status Gizi</div>
                <div
                  className={`text-sm font-semibold mt-1 ${
                    overallStatus.severity === 'high' ? 'text-red-900' : overallStatus.severity === 'medium' ? 'text-orange-900' : overallStatus.severity === 'warning' ? 'text-yellow-900' : 'text-green-900'
                  }`}
                >
                  {overallStatus.label.split(' ')[0]}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <Link href="/orangtua/anak" className="block">
                <Button className="w-full justify-start h-12 text-base bg-blue-600 hover:bg-blue-700">
                  <Users className="h-5 w-5 mr-3" />
                  Kelola Data Anak
                </Button>
              </Link>
            </div>
          </Card>
        </section>

        {/* MIDDLE: Anak List & Recent Measurements */}
        <section className="col-span-1 lg:col-span-1">
          <div className="space-y-6">
            {/* Daftar Anak */}
            <Card className="p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Baby className="h-5 w-5 text-blue-600" />
                  Data Anak
                </h2>
                <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                  {balita?.length || 0} Anak
                </Badge>
              </div>

              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-pulse">Memuat data anak...</div>
                </div>
              ) : balita && balita.length > 0 ? (
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {balita.map((anak) => {
                    const latestUkur = anak.pengukuran && anak.pengukuran.length > 0 ? anak.pengukuran[anak.pengukuran.length - 1] : null;

                    const statusBBTB = getNutritionStatus(latestUkur?.statusBBTB as NutritionStatus);
                    const statusBBU = getNutritionStatus(latestUkur?.statusBBU as NutritionStatus);
                    const statusTBU = getNutritionStatus(latestUkur?.statusTBU as NutritionStatus);

                    return (
                      <div key={anak.id} className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900 text-lg">{anak.nama}</h3>
                            <p className="text-sm text-slate-600 mt-1">
                              {anak.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'} • Anak ke-{anak.anakKe || '-'}
                            </p>
                          </div>
                          <div className="flex flex-col gap-1 items-end">
                            <Badge className={`${statusBBTB.color} flex items-center gap-1`}>
                              {getStatusIcon(statusBBTB.severity)}
                              {statusBBTB.label}
                            </Badge>
                          </div>
                        </div>

                        {latestUkur && (
                          <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-3 rounded-lg">
                            <div>
                              <span className="text-slate-700">
                                Berat: <strong>{latestUkur.beratKg} kg</strong>
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-700">
                                Tinggi: <strong>{latestUkur.tinggiCm} cm</strong>
                              </span>
                            </div>
                            <div className="col-span-2 grid grid-cols-3 gap-2 mt-2">
                              <div className="text-center">
                                <div className="text-xs text-slate-500">BB/U</div>
                                <div className={`text-xs font-medium ${statusBBU.color.split(' ')[1]}`}>{statusBBU.label.split(' ')[0]}</div>
                              </div>
                              <div className="text-center">
                                <div className="text-xs text-slate-500">TB/U</div>
                                <div className={`text-xs font-medium ${statusTBU.color.split(' ')[1]}`}>{statusTBU.label.split(' ')[0]}</div>
                              </div>
                              <div className="text-center">
                                <div className="text-xs text-slate-500">BB/TB</div>
                                <div className={`text-xs font-medium ${statusBBTB.color.split(' ')[1]}`}>{statusBBTB.label.split(' ')[0]}</div>
                              </div>
                            </div>
                          </div>
                        )}

                        {!latestUkur && <div className="text-center py-2 text-slate-500 text-sm">Belum ada data pengukuran</div>}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-lg">
                  <Baby className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 mb-4">Belum ada data anak terdaftar</p>
                  <Link href="/orangtua/anak/tambah">
                    <Button className="bg-blue-600 hover:bg-blue-700">Tambah Data Anak</Button>
                  </Link>
                </div>
              )}
            </Card>

            {/* Notifications/Reminders */}
            <Card className="p-6 bg-amber-50 border-amber-200 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <h3 className="font-semibold text-amber-900">Pengingat Penting</h3>
              </div>
              <ul className="space-y-2 text-sm text-amber-800">
                <li>• Jangan lupa jadwal posyandu bulan depan</li>
                <li>• Pastikan data pengukuran anak terbaru</li>
                <li>• Periksa perkembangan gizi anak secara berkala</li>
              </ul>
            </Card>
          </div>
        </section>

        {/* RIGHT: Progress & Quick Access */}
        <section className="col-span-1 lg:col-span-1">
          <div className="space-y-6">
            {/* Progress Status */}
            <Card className="p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Status Perkembangan
              </h2>

              {latestMeasurement ? (
                <div className="space-y-4">
                  <div
                    className={`text-center p-4 rounded-lg border ${
                      overallStatus.severity === 'high'
                        ? 'bg-red-50 border-red-200'
                        : overallStatus.severity === 'medium'
                        ? 'bg-orange-50 border-orange-200'
                        : overallStatus.severity === 'warning'
                        ? 'bg-yellow-50 border-yellow-200'
                        : 'bg-green-50 border-green-200'
                    }`}
                  >
                    <div className="text-sm font-medium">Status Gizi Terkini</div>
                    <div
                      className={`text-2xl font-bold mt-2 ${
                        overallStatus.severity === 'high' ? 'text-red-900' : overallStatus.severity === 'medium' ? 'text-orange-900' : overallStatus.severity === 'warning' ? 'text-yellow-900' : 'text-green-900'
                      }`}
                    >
                      {overallStatus.label}
                    </div>
                    <div className="text-xs mt-2">Terakhir diukur: {new Date(latestMeasurement.tanggal).toLocaleDateString('id-ID')}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="text-center p-3 bg-slate-50 rounded-lg">
                      <div className="text-slate-600">Berat Badan</div>
                      <div className="font-semibold text-slate-900">{latestMeasurement.beratKg} kg</div>
                    </div>
                    <div className="text-center p-3 bg-slate-50 rounded-lg">
                      <div className="text-slate-600">Tinggi Badan</div>
                      <div className="font-semibold text-slate-900">{latestMeasurement.tinggiCm} cm</div>
                    </div>
                  </div>

                  {/* Detail Status */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">Keterangan Status:</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      <div>
                        • <strong>BB/U</strong>: Berat Badan menurut Umur
                      </div>
                      <div>
                        • <strong>TB/U</strong>: Tinggi Badan menurut Umur
                      </div>
                      <div>
                        • <strong>BB/TB</strong>: Berat Badan menurut Tinggi Badan
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-slate-500">
                  <TrendingUp className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p>Belum ada data pengukuran</p>
                  <p className="text-sm mt-2">Silakan lakukan pengukuran di posyandu terdekat</p>
                </div>
              )}
            </Card>

            {/* Quick Access Menu */}
            <Card className="p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Akses Cepat</h2>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/orangtua/riwayat">
                  <Button variant="outline" className="w-full h-14 flex-col gap-1">
                    <FileText className="h-5 w-5" />
                    <span className="text-xs">Riwayat</span>
                  </Button>
                </Link>
                <Link href="/orangtua/konsultasi">
                  <Button variant="outline" className="w-full h-14 flex-col gap-1">
                    <MessageSquare className="h-5 w-5" />
                    <span className="text-xs">Konsultasi</span>
                  </Button>
                </Link>
                <Link href="/orangtua/laporan">
                  <Button variant="outline" className="w-full h-14 flex-col gap-1">
                    <DownloadCloud className="h-5 w-5" />
                    <span className="text-xs">Laporan</span>
                  </Button>
                </Link>
                <Link href="/orangtua/bantuan">
                  <Button variant="outline" className="w-full h-14 flex-col gap-1">
                    <Users className="h-5 w-5" />
                    <span className="text-xs">Bantuan</span>
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};
