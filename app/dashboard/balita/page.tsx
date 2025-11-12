import { DEFAULT_LIMIT } from '@/lib/utils';
import { HydrateClient, prefetch, trpc } from '@/trpc/server';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kelola Balita',
};

const Page = () => {
  prefetch(trpc.usersAdmin.getMany.queryOptions({ limit: DEFAULT_LIMIT }));

  return (
    <HydrateClient>
      {/* <UsersView /> */}
      Test
    </HydrateClient>
  );
};

export default Page;
