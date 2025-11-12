import { currentUser } from '@/actions/auth-server';
import { redirectMap } from '@/lib/utils';
import { redirect } from 'next/navigation';

const Page = async () => {
  const user = await currentUser();

  if (user) {
    const to = redirectMap[user.role] ?? '/';
    redirect(to);
  } else if (!user) {
    redirect('/login');
  }
};

export default Page;
