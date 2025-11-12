'use client';

import Link from 'next/link';
import { LayoutDashboardIcon, UserLockIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from '@/components/ui/sidebar';
import { DashboardSidebarFooter } from '@/components/features/dashboard/layout/dashboard-sidebar/dashboard-sidebar-footer';
import { KaderMain } from './kader-main';
import { DashboardSidebarHeader } from '@/components/features/dashboard/layout/dashboard-sidebar/dashboard-sidebar-header';
import { usePathname } from 'next/navigation';

export const KaderSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar className="pt-16 z-40" collapsible="icon">
      <DashboardSidebarHeader />
      <SidebarContent className="bg-background">
        <KaderMain label="Table" />
        <Separator />
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Dashboard" isActive={pathname === '/kader'}>
                <Link href="/kader">
                  <LayoutDashboardIcon />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Profile" isActive={pathname === '/kader/profile'}>
                <Link href="/kader/profile">
                  <UserLockIcon />
                  <span>Profile</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <DashboardSidebarFooter />
      <SidebarRail />
    </Sidebar>
  );
};
