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

export function formatNumber(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return '0';

  const num = Number(value);
  if (Number.isNaN(num)) return String(value);

  return new Intl.NumberFormat('id-ID').format(num);
}

export function computeZFromLMS(L: number, M: number, S: number, x: number): number {
  if (!isFinite(L) || !isFinite(M) || !isFinite(S) || !isFinite(x) || M === 0 || S === 0) return NaN;
  if (L === 0) {
    return Math.log(x / M) / S;
  }
  return (Math.pow(x / M, L) - 1) / (L * S);
}

export function computeZSimple(mean: number, sd: number, x: number): number {
  if (!isFinite(mean) || !isFinite(sd) || !isFinite(x) || sd === 0) return NaN;
  return (x - mean) / sd;
}

/** simple classifier mapping z -> NutritionStatus-ish strings */
export function classifyByZ(z: number | null, measure: 'WFA' | 'HFA' | 'WFH') {
  if (z === null || !isFinite(z)) return null;
  // use WHO-like thresholds (very common)
  if (measure === 'HFA') {
    if (z < -3) return 'SEVERELY_STUNTED';
    if (z < -2) return 'STUNTED';
    if (z <= 2) return 'NORMAL_TB_U';
    if (z > 2 && z < 3) return 'RISIKO_GEMUK';
    return 'OBESE';
  }
  // WFA / WFH -> weight based
  if (z < -3) return 'GIZI_BURUK';
  if (z < -2) return 'GIZI_KURANG';
  if (z <= 2) return 'GIZI_BAIK';
  if (z > 2 && z < 3) return 'GIZI_LEBIH';
  return 'OBESE';
}
