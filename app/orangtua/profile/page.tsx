import { currentUser } from '@/actions/auth-server';
import { ProfileUser } from '@/components/features/profile-user';
import { getUserById } from '@/lib/data/user';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile',
};

const Page = async () => {
  const user = await currentUser();
  if (!user || !user.id) return null;
  const userById = await getUserById(user.id);

  return <ProfileUser user={userById} />;
};

export default Page;
