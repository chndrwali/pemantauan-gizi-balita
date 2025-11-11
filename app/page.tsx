import { currentUser } from '@/actions/auth-server';
import { LogoutButton } from '@/components/features/auth/logout-button';
import { TestUser } from './user';
import { getUserById } from '@/lib/data/user';

const Page = async () => {
  const user = await currentUser();
  if (!user || !user.id) return null;
  const userById = await getUserById(user.id);
  return (
    <div>
      {JSON.stringify(user)}
      SAFE USER : <TestUser user={userById} />
      <LogoutButton />
    </div>
  );
};

export default Page;
