import { SidebarProvider } from '@/components/ui/sidebar';
import { PetugasSidebar } from './petugas-sidebar';
import { PetugasNavbar } from './petugas-navbar';

interface KaderLayoutProps {
  children: React.ReactNode;
}

const KaderLayout = ({ children }: KaderLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="w-full">
        <PetugasNavbar />
        <div className="flex min-h-screen pt-6">
          <PetugasSidebar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default KaderLayout;
