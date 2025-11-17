'use client';

import { ResponsiveModal } from '@/components/responsive-modal';
import { DetailBalita } from './detail-balita';
// import { UserMemberCard } from './user-member';

interface Props {
  id: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export const DetailBalitaModal = ({ id, onOpenChange, open }: Props) => {
  return (
    <ResponsiveModal title="Detail Balita" open={open} onOpenChange={onOpenChange} width="max-w-[1000px]">
      <DetailBalita id={id} />
    </ResponsiveModal>
  );
};
