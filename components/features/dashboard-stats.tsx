'use client';

import React from 'react';
import { useTRPC } from '@/trpc/client';
import { Card } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
// import { Grid } from '@/components/ui/grid';
import { Users, Home, Activity, MapPin, Clipboard, Bell } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';

// Small presentational stat card
function StatCard({ title, value, delta, icon }: { title: string; value: number | string; delta?: string; icon?: React.ReactNode }) {
  return (
    <Card className="p-4 flex items-start gap-4">
      <div className="w-12 h-12 rounded-md bg-slate-50 flex items-center justify-center text-slate-800">{icon}</div>
      <div className="flex-1">
        <div className="text-xs text-slate-500">{title}</div>
        <div className="text-2xl font-semibold text-slate-900">{typeof value === 'number' ? formatNumber(value) : value}</div>
        {delta && <div className="text-xs text-slate-500 mt-1">{delta}</div>}
      </div>
    </Card>
  );
}

// --- Admin view: show full set of metrics ---
export const AdminDashboardStats = () => {
  const trpc = useTRPC();
  const q = useQuery(trpc.usersPetugas.getCounts.queryOptions());

  if (q.isLoading)
    return (
      <div className="p-6 flex justify-center">
        <Spinner />
      </div>
    );
  if (!q.data?.totals) return <div className="p-6 text-sm text-slate-500">Tidak ada data</div>;

  const t = q.data.totals;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Pengguna (total)" value={t.usersTotal ?? 0} icon={<Users />} />
      <StatCard title="Kader" value={t.usersByRole?.KADER ?? 0} icon={<Activity />} />
      <StatCard title="Petugas" value={t.usersByRole?.PETUGAS ?? 0} icon={<Clipboard />} />
      <StatCard title="Orang Tua" value={t.usersByRole?.ORANGTUA ?? 0} icon={<Users />} />

      <StatCard title="Posyandu" value={t.posyanduTotal ?? 0} icon={<Home />} />
      <StatCard title="Balita" value={t.balitaTotal ?? 0} icon={<MapPin />} />
      <StatCard title="Penimbangan" value={t.timbangTotal ?? 0} icon={<Clipboard />} />
      <StatCard title="Event / Kunjungan" value={t.eventTotal ?? 0} icon={<Bell />} />

      <StatCard title="Kunjungan (rows)" value={t.kunjunganTotal ?? 0} icon={<Activity />} />
      <StatCard title="Monthly Stats cache" value={t.monthlyStatsTotal ?? 0} icon={<Activity />} />
      <StatCard title="Notifikasi" value={t.notificationTotal ?? 0} icon={<Bell />} />
    </div>
  );
};

// --- Petugas view: pick a subset appropriate for operational staff ---
export const PetugasDashboardStats = () => {
  const trpc = useTRPC();
  const q = useQuery(trpc.usersPetugas.getCounts.queryOptions());

  if (q.isLoading)
    return (
      <div className="p-6 flex justify-center">
        <Spinner />
      </div>
    );
  if (!q.data?.totals) return <div className="p-6 text-sm text-slate-500">Tidak ada data</div>;

  const t = q.data.totals;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard title="Posyandu" value={t.posyanduTotal ?? 0} icon={<Home />} />
      <StatCard title="Balita (area)" value={t.balitaTotal ?? 0} icon={<MapPin />} />
      <StatCard title="Penimbangan" value={t.timbangTotal ?? 0} icon={<Clipboard />} />
      <StatCard title="Event" value={t.eventTotal ?? 0} icon={<Bell />} />
      <StatCard title="Kunjungan" value={t.kunjunganTotal ?? 0} icon={<Activity />} />
      <StatCard title="Notifikasi" value={t.notificationTotal ?? 0} icon={<Bell />} />
    </div>
  );
};

// --- Kader view: lighter, focused on field work ---
export const KaderDashboardStats = () => {
  const trpc = useTRPC();
  const q = useQuery(trpc.usersPetugas.getCounts.queryOptions());

  if (q.isLoading)
    return (
      <div className="p-6 flex justify-center">
        <Spinner />
      </div>
    );
  if (!q.data?.totals) return <div className="p-6 text-sm text-slate-500">Tidak ada data</div>;

  const t = q.data.totals;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <StatCard title="Balita (area)" value={t.balitaTotal ?? 0} icon={<MapPin />} />
      <StatCard title="Penimbangan" value={t.timbangTotal ?? 0} icon={<Clipboard />} />
      <StatCard title="Event / Posyandu" value={t.eventTotal ?? 0} icon={<Home />} />
      <StatCard title="Kunjungan" value={t.kunjunganTotal ?? 0} icon={<Activity />} />
    </div>
  );
};
