'use client';

import { ResponsiveModal } from '@/components/responsive-modal';
import { UpdateUserForm } from './update-user-form';

interface Props {
  id: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export const UserUpdateModal = ({ id, onOpenChange, open }: Props) => {
  return (
    <ResponsiveModal title="Update Akun" open={open} onOpenChange={onOpenChange}>
      <UpdateUserForm userId={id} onSuccess={() => onOpenChange(false)} />
    </ResponsiveModal>
  );
};
