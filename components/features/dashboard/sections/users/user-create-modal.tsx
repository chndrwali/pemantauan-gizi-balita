'use client';

import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { ResponsiveModal } from '@/components/responsive-modal';
import { useState } from 'react';
import { RegisterForm } from '@/components/features/auth/register-form';

export const UserCreateModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ResponsiveModal title="Pendaftaran Akun" open={open} onOpenChange={setOpen}>
        <RegisterForm />
      </ResponsiveModal>
      <Button type="button" variant="outline" onClick={() => setOpen(true)} className="w-fit">
        <PlusIcon />
        Buat Akun
      </Button>
    </>
  );
};
