import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { DashboardNavbar } from './dashboard-navbar';
import { DashboardSidebar } from './dashboard-sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      {/* Sidebar tetap di luar */}
      <DashboardSidebar />

      {/* Semua konten, termasuk Navbar, dibungkus SidebarInset */}
      <SidebarInset>
        <DashboardNavbar />
        <main className="min-h-screen pt-16 overflow-y-auto">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};
