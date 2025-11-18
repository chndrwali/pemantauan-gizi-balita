import { currentUser } from '@/actions/auth-server';
import { OrangTuaSections } from '@/components/features/orangtua/sections/orangtua-beranda';
import { getUserById } from '@/lib/data/user';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Orang Tua',
};

const Page = async () => {
  const user = await currentUser();
  if (!user || !user.id) return null;
  const userById = await getUserById(user.id);

  return <OrangTuaSections user={userById} />;
};

export default Page;
