import { AdminDashboardStats } from '@/components/features/dashboard-stats';
import { HydrateClient, prefetch, trpc } from '@/trpc/server';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin',
};

const Page = () => {
  prefetch(trpc.usersPetugas.getCounts.queryOptions());

  return (
    <HydrateClient>
      <div className="flex flex-col gap-y-6 py-2.5 px-4">
        <div className="flex items-center px-4">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-xs text-muted-foreground">Lihat rangkuman data Posyandu, pengguna, balita, penimbangan, dan aktivitas lainnya. Admin memiliki akses penuh.</p>
          </div>
        </div>

        <AdminDashboardStats />
      </div>
    </HydrateClient>
  );
};

export default Page;
