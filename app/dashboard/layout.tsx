import { currentUser } from '@/actions/auth-server';
import DashboardLayoutClient from '@/components/features/dashboard/layout/dashboard layout-client';
import { redirect } from 'next/navigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = async ({ children }: LayoutProps) => {
  const user = await currentUser();

  if (!user) {
    redirect('/login');
  }

  const isAdmin = user.role === 'PUSKESMAS';

  if (!isAdmin) {
    redirect('/');
  }

  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
};

export default Layout;
