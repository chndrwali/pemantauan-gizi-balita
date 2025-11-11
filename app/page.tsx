import { currentUser } from '@/actions/auth-server';
import { LogoutButton } from '@/components/features/auth/logout-button';
import { TestUser } from './user';
import { getUserById } from '@/lib/data/user';
// import { redirectMap } from '@/lib/utils';
// import { redirect } from 'next/navigation';

const Page = async () => {
  const user = await currentUser();
  if (!user || !user.id) return null;
  const userById = await getUserById(user.id);

  // if (user) {
  //   const to = redirectMap[user.role] ?? '/';
  //   redirect(to);
  // } else if (!user) {
  //   redirect('/login')
  // }
  return (
    <div>
      {JSON.stringify(user)}
      SAFE USER : <TestUser user={userById} />
      <LogoutButton />
    </div>
  );
};

export default Page;
