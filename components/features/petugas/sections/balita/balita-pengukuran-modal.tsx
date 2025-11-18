'use client';

import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { ResponsiveModal } from '@/components/responsive-modal';
import { useState } from 'react';
import { AddPengukuranForm } from './add-pengukuran-form';

export const BalitaPengukuranModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ResponsiveModal title="Tambah Pengukuran Balita" open={open} onOpenChange={setOpen}>
        <AddPengukuranForm />
      </ResponsiveModal>
      <Button type="button" variant="outline" onClick={() => setOpen(true)} className="w-fit">
        <PlusIcon />
        Tambah Pengukuran Balita
      </Button>
    </>
  );
};
