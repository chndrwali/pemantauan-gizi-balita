import { currentUser } from '@/actions/auth-server';
import { DashboardLayout } from '@/components/features/dashboard/layout/dashboard-layout';
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

  return <DashboardLayout>{children}</DashboardLayout>;
};

export default Layout;
