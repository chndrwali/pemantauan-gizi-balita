'use client';

import { MegaphoneIcon } from 'lucide-react';
import { ResponsiveModal } from '@/components/responsive-modal';
import { useState } from 'react';
import { NotificationFormPetugas } from './notification-form-petugas';
import { SidebarMenuButton } from '@/components/ui/sidebar';

export const PetugasNotificationModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ResponsiveModal title="Kirim Notifikasi" open={open} onOpenChange={setOpen} width="max-w-lg">
        <NotificationFormPetugas />
      </ResponsiveModal>
      <SidebarMenuButton
        tooltip="Kirim Notifikasi"
        onClick={() => {
          setOpen(true);
        }}
      >
        <MegaphoneIcon className="size-4" />
        Kirim Notifikasi
      </SidebarMenuButton>
    </>
  );
};
