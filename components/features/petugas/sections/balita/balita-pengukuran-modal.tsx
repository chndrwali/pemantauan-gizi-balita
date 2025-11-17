'use client';

import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { ResponsiveModal } from '@/components/responsive-modal';
import { useState } from 'react';

export const BalitaPengukuranModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ResponsiveModal title="Pendaftaran Balita" open={open} onOpenChange={setOpen}>
        Test
      </ResponsiveModal>
      <Button type="button" variant="outline" onClick={() => setOpen(true)} className="w-fit">
        <PlusIcon />
        Tambah Pengukuran Balita
      </Button>
    </>
  );
};
