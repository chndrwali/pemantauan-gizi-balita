import { UsersPetugasView } from '@/components/features/petugas/sections/users/user-petugas-view';
import { DEFAULT_LIMIT } from '@/lib/utils';
import { HydrateClient, prefetch, trpc } from '@/trpc/server';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kelola Pengguna',
};

const Page = () => {
  prefetch(trpc.usersPetugas.getMany.queryOptions({ limit: DEFAULT_LIMIT }));

  return (
    <HydrateClient>
      <UsersPetugasView />
    </HydrateClient>
  );
};

export default Page;
