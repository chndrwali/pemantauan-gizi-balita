import { Role, User } from '@/lib/generated/prisma/client';

interface Props {
  user: (User & { role: Role }) | null;
}

export const TestUser = (user: Props) => {
  return <div>{JSON.stringify(user)}</div>;
};
