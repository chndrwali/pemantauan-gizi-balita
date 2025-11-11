'use client';

import Link from 'next/link';
import { HomeIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Sidebar, SidebarContent, SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from '@/components/ui/sidebar';
import { DashboardSidebarFooter } from './dashboard-sidebar-footer';
import { ProjectMain } from './dashboard-main';
import { DashboardSidebarHeader } from './dashboard-sidebar-header';

export const DashboardSidebar = () => {
  return (
    <Sidebar className="pt-16 z-40" collapsible="icon">
      <DashboardSidebarHeader />
      <SidebarContent className="bg-background">
        <ProjectMain label="Menu" />
        <Separator />
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Keluar dashboard" asChild>
                <Link prefetch href="/">
                  <HomeIcon className="size-5" />
                  <span className="text-sm">Keluar dashboard</span>
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
