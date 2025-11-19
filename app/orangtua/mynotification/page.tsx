import { currentUser } from '@/actions/auth-server';
import { OrangTuaNotification } from '@/components/features/orangtua/sections/orangtua-notification';
import { DEFAULT_LIMIT } from '@/lib/utils';
import { HydrateClient, prefetch, trpc } from '@/trpc/server';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Notifikasi Saya',
};

const Page = async () => {
  prefetch(trpc.usersPetugas.getNotificationByUserId.queryOptions({ limit: DEFAULT_LIMIT }));

  const user = await currentUser();
  if (!user || !user.id) {
    redirect('/orangtua');
  }

  return (
    <HydrateClient>
      <OrangTuaNotification id={user.id} />
    </HydrateClient>
  );
};

export default Page;
