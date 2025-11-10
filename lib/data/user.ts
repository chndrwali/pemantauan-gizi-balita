import prisma from '@/lib/db';
import { User } from '@/lib/generated/prisma/client';

export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    return await prisma.user.findUnique({
      where: { email },
    });
  } catch {
    return null;
  }
};

export const getUserById = async (id: string): Promise<User | null> => {
  try {
    return await prisma.user.findUnique({
      where: { id },
    });
  } catch {
    return null;
  }
};
