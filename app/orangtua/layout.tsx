import { currentUser } from '@/actions/auth-server';
import { redirect } from 'next/navigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = async ({ children }: LayoutProps) => {
  const user = await currentUser();

  if (!user) {
    redirect('/login');
  }

  const isParent = user.role === 'ORANGTUA';

  if (!isParent) {
    redirect('/');
  }

  return <>{children}</>;
};

export default Layout;
