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

export const getInitials = (name: string): string =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

export const DEFAULT_LIMIT = 10;
export const AVATAR_FALLBACK = '/logo/logo.png';

export const normalizePhone = (phone?: string) => {
  if (!phone) return null;
  // contoh sederhana: jika mulai 0 -> ganti +62
  const raw = phone.replace(/\D/g, '');
  if (raw.startsWith('0')) return '+62' + raw.slice(1);
  if (raw.startsWith('62')) return '+' + raw;
  if (raw.startsWith('+')) return raw;
  return '+' + raw;
};
