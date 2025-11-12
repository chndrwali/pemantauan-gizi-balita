import { currentUser } from '@/actions/auth-server';
import PetugasLayoutClient from '@/components/features/petugas/layout/petugas-layout-client';
import { redirect } from 'next/navigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = async ({ children }: LayoutProps) => {
  const user = await currentUser();

  if (!user) {
    redirect('/login');
  }

  const isPetugas = user.role === 'PETUGAS';

  if (!isPetugas) {
    redirect('/');
  }

  return <PetugasLayoutClient>{children}</PetugasLayoutClient>;
};

export default Layout;
