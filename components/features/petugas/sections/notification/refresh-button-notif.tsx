'use client';

import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const RefreshButtonNotification = () => {
  const router = useRouter();

  return (
    <Button onClick={() => router.push('/petugas/notification')} variant="outline" size="lg">
      <RefreshCcw className="size-4" /> Refresh
    </Button>
  );
};
