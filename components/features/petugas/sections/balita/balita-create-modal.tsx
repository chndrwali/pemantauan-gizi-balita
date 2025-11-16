'use client';

import { Button } from '@/components/ui/button';
import { PlusIcon, RefreshCcwIcon } from 'lucide-react';
import { ResponsiveModal } from '@/components/responsive-modal';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AddBalitaForm } from './add-balita-form';

export const BalitaCreateModal = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <>
      <ResponsiveModal title="Pendaftaran Balita" open={open} onOpenChange={setOpen}>
        <AddBalitaForm />
      </ResponsiveModal>
      <div className="flex items-center gap-x-2">
        <Button variant="outline" size="sm" onClick={() => router.refresh()}>
          <RefreshCcwIcon className="size-4" /> Refresh
        </Button>
        <Button type="button" variant="outline" onClick={() => setOpen(true)} className="w-fit">
          <PlusIcon />
          Tambah Balita
        </Button>
      </div>
    </>
  );
};
