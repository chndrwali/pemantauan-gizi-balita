import { BalitaView } from '@/components/features/petugas/sections/balita/balita-view';
import { DEFAULT_LIMIT } from '@/lib/utils';
import { HydrateClient, prefetch, trpc } from '@/trpc/server';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Balita',
};

const Page = () => {
  prefetch(trpc.balita.getManyBalita.queryOptions({ limit: DEFAULT_LIMIT }));

  return (
    <HydrateClient>
      <BalitaView />
    </HydrateClient>
  );
};

export default Page;
