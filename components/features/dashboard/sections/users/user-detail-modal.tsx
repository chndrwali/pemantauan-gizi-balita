'use client';

import { ResponsiveModal } from '@/components/responsive-modal';
import { UserMemberCard } from './user-member';

interface Props {
  id: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export const UserDetailModal = ({ id, onOpenChange, open }: Props) => {
  return (
    <ResponsiveModal title="Detail Pengguna" open={open} onOpenChange={onOpenChange} width="max-w-[1000px]">
      <UserMemberCard id={id} />
    </ResponsiveModal>
  );
};
