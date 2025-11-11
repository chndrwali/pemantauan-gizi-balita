import { UsersView } from '@/components/features/dashboard/sections/users/user-view';
import { DEFAULT_LIMIT } from '@/lib/utils';
import { HydrateClient, prefetch, trpc } from '@/trpc/server';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kelola Pengguna',
};

const Page = () => {
  prefetch(trpc.usersAdmin.getMany.queryOptions({ limit: DEFAULT_LIMIT }));

  return (
    <HydrateClient>
      <UsersView />
    </HydrateClient>
  );
};

export default Page;
