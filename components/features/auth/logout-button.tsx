'use client';

import { logout } from '@/actions/logout';
import { Button } from '@/components/ui/button';

export const LogoutButton = () => {
  return <Button onClick={() => logout()}>Logout</Button>;
};
