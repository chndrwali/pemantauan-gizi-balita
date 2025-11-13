import { PetugasDashboardStats } from '@/components/features/dashboard-stats';
import { HydrateClient, prefetch, trpc } from '@/trpc/server';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Petugas',
};

const Page = () => {
  prefetch(trpc.usersPetugas.getCounts.queryOptions());

  return (
    <HydrateClient>
      <div className="flex flex-col gap-y-6 py-2.5 px-4">
        <div className="flex items-center px-4">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-xs text-muted-foreground">Rangkuman data balita, posyandu, dan kegiatan penimbangan. Petugas tidak dapat menambah atau mengubah akun.</p>
          </div>
        </div>

        <PetugasDashboardStats />
      </div>
    </HydrateClient>
  );
};

export default Page;
