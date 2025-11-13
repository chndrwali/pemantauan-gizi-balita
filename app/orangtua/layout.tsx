import { currentUser } from '@/actions/auth-server';
import OrangTuaLayoutClient from '@/components/features/orangtua/orangtua-layout-client';
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

  return <OrangTuaLayoutClient>{children}</OrangTuaLayoutClient>;
};

export default Layout;
