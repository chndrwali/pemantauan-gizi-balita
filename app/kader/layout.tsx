import { currentUser } from '@/actions/auth-server';
import KaderLayoutClient from '@/components/features/kader/layout/kader-layout-client';
import { redirect } from 'next/navigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = async ({ children }: LayoutProps) => {
  const user = await currentUser();

  if (!user) {
    redirect('/login');
  }

  const isKader = user.role === 'KADER';

  if (!isKader) {
    redirect('/');
  }

  return <KaderLayoutClient>{children}</KaderLayoutClient>;
};

export default Layout;
