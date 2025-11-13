'use client';

import Link from 'next/link';
import { LayoutDashboardIcon, UserLockIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from '@/components/ui/sidebar';
import { DashboardSidebarFooter } from '@/components/features/dashboard/layout/dashboard-sidebar/dashboard-sidebar-footer';

import { DashboardSidebarHeader } from '@/components/features/dashboard/layout/dashboard-sidebar/dashboard-sidebar-header';
import { usePathname } from 'next/navigation';
import { PetugasMain } from './petugas-main';
import { PetugasNotificationModal } from '../../sections/users/petugas-notification-modal';

export const PetugasSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar className="pt-16 z-40" collapsible="icon">
      <DashboardSidebarHeader />
      <SidebarContent className="bg-background">
        <PetugasMain label="Table" />
        <Separator />
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Dashboard" isActive={pathname === '/petugas'}>
                <Link href="/petugas">
                  <LayoutDashboardIcon />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Profile" isActive={pathname === '/petugas/profile'}>
                <Link href="/petugas/profile">
                  <UserLockIcon />
                  <span>Profile</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <PetugasNotificationModal />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <DashboardSidebarFooter />
      <SidebarRail />
    </Sidebar>
  );
};
