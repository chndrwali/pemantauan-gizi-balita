'use client';

import Link from 'next/link';
import { LayoutDashboardIcon, UserLockIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from '@/components/ui/sidebar';
import { DashboardSidebarFooter } from './dashboard-sidebar-footer';
import { ProjectMain } from './dashboard-main';
import { DashboardSidebarHeader } from './dashboard-sidebar-header';
import { usePathname } from 'next/navigation';

export const DashboardSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar className="pt-16 z-40" collapsible="icon">
      <DashboardSidebarHeader />
      <SidebarContent className="bg-background">
        <ProjectMain label="Table" />
        <Separator />
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Dashboard" isActive={pathname === '/dashboard'}>
                <Link href="/dashboard">
                  <LayoutDashboardIcon />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Profile" isActive={pathname === '/dashboard/profile'}>
                <Link href="/dashboard/profile">
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
