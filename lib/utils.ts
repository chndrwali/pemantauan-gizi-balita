import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const redirectMap: Record<string, string> = {
  PUSKESMAS: '/dashboard',
  PETUGAS: '/petugas',
  KADER: '/kader',
  ORANGTUA: '/orangtua',
};
