'use client';

import { Button } from '@/components/ui/button';
import { PlusIcon, RefreshCcwIcon } from 'lucide-react';
import { ResponsiveModal } from '@/components/responsive-modal';
import { useState } from 'react';
import { RegisterForm } from '@/components/features/auth/register-form';
import { useRouter } from 'next/navigation';

export const UserCreateModal = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <>
      <ResponsiveModal title="Pendaftaran Akun" open={open} onOpenChange={setOpen}>
        <RegisterForm />
      </ResponsiveModal>
      <div className="flex items-center gap-x-2">
        <Button variant="outline" size="sm" onClick={() => router.refresh()}>
          <RefreshCcwIcon className="size-4" /> Refresh
        </Button>
        <Button type="button" variant="outline" onClick={() => setOpen(true)} className="w-fit">
          <PlusIcon />
          Buat Akun
        </Button>
      </div>
    </>
  );
};
