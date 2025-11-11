import { useCurrentUser } from '@/actions/auth-client';
import { SidebarHeader } from '@/components/ui/sidebar';
import Image from 'next/image';

export const DashboardSidebarHeader = () => {
  const currentUser = useCurrentUser();

  const mappedRole = currentUser?.role === 'PUSKESMAS' ? 'Admin' : currentUser?.role;

  const company = {
    name: 'Puskesmas Sukawarna',
    plan: mappedRole ?? '',
  };

  return (
    <SidebarHeader>
      <div className="flex gap-2 py-2 text-sidebar-accent-foreground">
        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <Image src="/logo/logo.png" alt="logo" width={32} height={32} />
        </div>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">{company.name}</span>
          <span className="truncate text-xs">{company.plan}</span>
        </div>
      </div>
    </SidebarHeader>
  );
};
