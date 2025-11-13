import { NotificationPetugasView } from '@/components/features/petugas/sections/notification/notification-view';
import { DEFAULT_LIMIT } from '@/lib/utils';
import { HydrateClient, prefetch, trpc } from '@/trpc/server';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notifikasi',
};

const Page = () => {
  prefetch(trpc.usersPetugas.getNotificationMany.queryOptions({ limit: DEFAULT_LIMIT }));

  return (
    <HydrateClient>
      <NotificationPetugasView />
    </HydrateClient>
  );
};

export default Page;
