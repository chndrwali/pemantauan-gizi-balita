import { SidebarProvider } from '@/components/ui/sidebar';
import { KaderdNavbar } from './kader-navbar';
import { KaderSidebar } from './kader-sidebar';

interface KaderLayoutProps {
  children: React.ReactNode;
}

const KaderLayout = ({ children }: KaderLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="w-full">
        <KaderdNavbar />
        <div className="flex min-h-screen pt-6">
          <KaderSidebar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default KaderLayout;
