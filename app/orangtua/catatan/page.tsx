import { OrangTuaCatatanSection } from '@/components/features/orangtua/sections/orangtua-catatan';
import { DEFAULT_LIMIT } from '@/lib/utils';
import { HydrateClient, prefetch, trpc } from '@/trpc/server';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Orang Tua',
};

const Page = () => {
  prefetch(trpc.orangtua.getCatatan.queryOptions({ limit: DEFAULT_LIMIT }));

  return (
    <HydrateClient>
      <OrangTuaCatatanSection />
    </HydrateClient>
  );
};

export default Page;
