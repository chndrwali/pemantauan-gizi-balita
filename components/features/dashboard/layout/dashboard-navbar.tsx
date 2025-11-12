'use client';

import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

const now = new Date();
const formattedDate = now.toLocaleDateString('id-ID', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export const DashboardNavbar = () => {
  return (
    <nav className="sticky top-0 z-50 h-16 bg-background flex items-center px-2 pr-5 border-b shadow-md">
      <div className="flex items-center gap-4 w-full">
        <div className="flex items-center shrink-0">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex flex-items-center leading-tight">
            <span className="font-semibold text-sm">Dashboard Admin</span>
          </div>
        </div>

        <div className="flex-1 text-center text-sm text-muted-foreground" suppressHydrationWarning={true}>
          {formattedDate}
        </div>
      </div>
    </nav>
  );
};
