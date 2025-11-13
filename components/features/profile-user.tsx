'use client';

import React from 'react';
import { Role, User } from '@/lib/generated/prisma/client';
import { toast } from 'sonner';
import Link from 'next/link';

interface Props {
  user: (User & { role: Role }) | null;
}

const roleMeta: Record<string, { label: string; bg: string; text: string }> = {
  KADER: { label: 'KADER', bg: 'bg-sky-500', text: 'text-white' },
  PETUGAS: { label: 'PETUGAS', bg: 'bg-amber-400', text: 'text-emerald-900' },
  PUSKESMAS: { label: 'ADMIN', bg: 'bg-emerald-600', text: 'text-white' },
  ORANGTUA: { label: 'Orang Tua', bg: 'bg-indigo-500', text: 'text-white' },
};

const prettyDate = (d?: string | Date | null) => {
  if (!d) return '-';
  const date = typeof d === 'string' ? new Date(d) : new Date(d);
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};

const maskNIK = (nik?: string | null) => {
  if (!nik) return '-';
  // show first 4 and last 2 only
  const start = nik.slice(0, 4);
  const end = nik.slice(-2);
  return `${start}••••••••${end}`;
};

export const ProfileUser = ({ user }: Props) => {
  if (!user)
    return (
      <div className="w-full max-w-lg mx-auto p-6 rounded-lg border border-slate-100 bg-white shadow-sm text-center">
        <div className="text-sm text-slate-500">Pengguna tidak ditemukan.</div>
      </div>
    );

  const meta = roleMeta[user.role] ?? { label: (user.role as string) ?? 'UNKNOWN', bg: 'bg-slate-200', text: 'text-slate-800' };

  // If role is ORANGTUA -> render simplified mobile-first profile

  if (user.role === 'ORANGTUA') {
    return (
      <div className="w-full mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* LEFT: Avatar + basic */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-5 flex flex-col items-center">
              <div className="w-28 h-28 rounded-lg flex items-center justify-center bg-emerald-600 text-white text-3xl font-bold">
                {user.name
                  ? user.name
                      .split(' ')
                      .map((s) => s[0])
                      .slice(0, 2)
                      .join('')
                  : '?'}
              </div>

              <div className="mt-4 text-center">
                <div className="text-lg font-semibold text-slate-900 leading-tight">{user.name ?? '-'}</div>
                <div className="mt-1 text-sm text-slate-500">@{user.username ?? user.email ?? '-'}</div>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${meta.bg} ${meta.text}`}>{meta.label}</span>
                </div>
              </div>

              <div className="mt-4 w-full space-y-2">
                <div className="text-xs text-slate-500">Bergabung</div>
                <div className="text-sm font-medium text-slate-700">{prettyDate(user.createdAt)}</div>
              </div>

              {/* quick contact */}
              <div className="mt-5 w-full">
                <button onClick={() => window.open(`tel:${user.phone ?? ''}`)} className="w-full py-2 rounded-md bg-emerald-600 text-white font-medium">
                  {user.phone ?? '-'}
                </button>
              </div>
            </div>
          </div>

          {/* MIDDLE: Action cards (bigger on desktop) */}
          <div className="col-span-1 md:col-span-1">
            <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
              <ActionCardLarge label="Jadwal Imunisasi" href="/orangtua/jadwal" icon="calendar" />
              <ActionCardLarge label="Catatan Balita" href="/orangtua/catatan" icon="file-text" />
              <ActionCardLarge label="Posyandu / Janji" href="/orangtua/janji" icon="map-pin" />
              <ActionCardLarge label="Daftar Anak" href="/orangtua/anak" icon="users" />
            </div>

            {/* small summary */}
            <div className="mt-4 bg-white rounded-lg border border-slate-100 p-4 shadow-sm">
              <div className="text-sm text-slate-500">Ringkasan</div>
              <div className="mt-2 text-sm text-slate-800">
                {/* placeholder stat, replace with real data */}
                <div className="flex justify-between">
                  <div>Jumlah Anak</div>
                  <div className="font-medium">1</div>
                </div>
                <div className="flex justify-between mt-2">
                  <div>Imunisasi berikutnya</div>
                  <div className="font-medium text-amber-600">14 Nov 2025</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Details list (bigger cards, easier scan on desktop) */}
          <div className="col-span-1 md:col-span-1">
            <div className="space-y-3">
              <MiniInfo label="NIK" value={maskNIK(user.nik)} />
              <MiniInfo label="Kontak" value={user.phone ?? '-'} copyable />
              <MiniInfo label="Email" value={user.email ?? '-'} copyable />
              <MiniInfo label="Alamat" value={formatAddress(user)} />
              <MiniInfo label="RT / RW" value={`${user.rt ?? '-'} / ${user.rw ?? '-'}`} />
              <MiniInfo label="Kelurahan" value={user.kelurahan ?? '-'} />
              <MiniInfo label="Kecamatan" value={user.kecamatan ?? '-'} />
            </div>

            <div className="mt-4 flex gap-2">
              <Link href="/ortu/imunisasi/pdf" className="flex-1 text-center py-2 rounded-md bg-emerald-600 text-white font-semibold shadow-sm">
                Download Kartu Imunisasi
              </Link>
              <button onClick={() => toast('Cetak (placeholder)')} className="px-4 py-2 rounded-md border border-slate-100 bg-white">
                Cetak
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Otherwise render admin-style detailed profile (desktop-friendly)
  return (
    <div className="w-full max-w-3xl mx-auto p-6 rounded-xl bg-white shadow-sm border border-slate-100">
      <div className="flex flex-col md:flex-row gap-6">
        {/* LEFT: Avatar */}
        <div className="shrink-0 flex items-center gap-4">
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-emerald-50 flex items-center justify-center border border-slate-100">
            {user.name ? (
              <div className="w-full h-full flex items-center justify-center bg-emerald-600 text-white text-2xl font-bold">
                {user.name
                  .split(' ')
                  .map((s) => s[0])
                  .slice(0, 2)
                  .join('')}
              </div>
            ) : (
              <div className="text-slate-400">?</div>
            )}
          </div>
        </div>

        {/* RIGHT: Info */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-slate-900 leading-tight">{user.name ?? '-'}</h2>

                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${meta.bg} ${meta.text} shadow-sm`}>{meta.label}</span>
              </div>

              <div className="mt-2 text-sm text-slate-600">@{user.username ?? user.email ?? '-'}</div>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-500">Bergabung</div>
              <div className="text-sm font-medium text-slate-700">{prettyDate(user.createdAt)}</div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Column A: Identitas */}
            <div className="space-y-3">
              <InfoRow label="NIK" value={user.nik ?? '-'} />
              <InfoRow label="Alamat" value={formatAddress(user)} />
              <InfoRow label="RT / RW" value={`${user.rt ?? '-'} / ${user.rw ?? '-'}`} />
              <InfoRow label="Kelurahan" value={user.kelurahan ?? '-'} />
              <InfoRow label="Kecamatan" value={user.kecamatan ?? '-'} />
            </div>

            {/* Column B: Kontak & Role-specific */}
            <div className="space-y-3">
              <InfoRow label="Kontak" value={user.phone ?? '-'} copyable />
              <InfoRow label="Email" value={user.email ?? '-'} copyable />

              {/* Role-specific: show SIP + Kode Wilayah for roles except ORANGTUA */}
              <>
                <InfoRow label="No. SIP" value={user.nomorSIP ?? '-'} />
                <InfoRow label="Kode Wilayah" value={user.kodeWilayah ?? '-'} />
              </>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-slate-600">Terakhir diperbarui: {prettyDate(user.updatedAt ?? user.createdAt)}</div>

            <div className="flex items-center gap-2">
              <button className="px-3 py-1 rounded-md bg-white text-slate-800 border border-slate-200 shadow-sm text-sm">Edit</button>
              <button className="px-3 py-1 rounded-md bg-sky-600 text-white text-sm hover:bg-sky-700">Export</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ----------------- small helper components ----------------- */

function ActionCardLarge({ label, href, onClick, icon }: { label: string; href?: string; onClick?: () => void; icon?: string }) {
  const content = (
    <div className="flex items-center gap-3 p-4 rounded-lg bg-white border border-slate-100 shadow-sm">
      <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-2xl text-emerald-600">
        {/* simple icon fallback */}
        {icon === 'calendar' ? '📅' : icon === 'file-text' ? '📋' : icon === 'map-pin' ? '📍' : '👶'}
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium text-slate-800">{label}</div>
        <div className="text-xs text-slate-500">Tap untuk lihat</div>
      </div>
      <div className="text-slate-300">{'>'}</div>
    </div>
  );

  if (href)
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  return (
    <button onClick={onClick} className="w-full text-left">
      {content}
    </button>
  );
}

// function ActionCard({ label, href, onClick }: { label: string; href?: string; onClick?: () => void }) {
//   const content = (
//     <div className="flex flex-col items-start gap-2 p-3 bg-white rounded-lg border border-slate-100 shadow-sm w-full">
//       <div className="text-sm font-medium text-slate-800">{label}</div>
//       <div className="text-xs text-slate-500">Tap untuk lihat</div>
//     </div>
//   );
//   if (href) {
//     return (
//       <Link href={href} className="block">
//         {content}
//       </Link>
//     );
//   }
//   return (
//     <button onClick={onClick} className="w-full">
//       {content}
//     </button>
//   );
// }

function MiniInfo({ label, value, copyable }: { label: string; value: React.ReactNode; copyable?: boolean }) {
  return (
    <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-100">
      <div>
        <div className="text-xs text-slate-500">{label}</div>
        <div className="text-sm font-medium text-slate-800 wrap-break-word">{value}</div>
      </div>
      {copyable && <CopyButton text={String(value ?? '')} />}
    </div>
  );
}

function InfoRow({ label, value, copyable }: { label: string; value: React.ReactNode; copyable?: boolean }) {
  return (
    <div className="flex items-start justify-between bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
      <div>
        <div className="text-xs text-slate-500">{label}</div>
        <div className="text-sm font-medium text-slate-800 wrap-break-word">{value}</div>
      </div>
      {copyable && <CopyButton text={String(value ?? '')} />}
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast('Disalin: ' + text);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      toast('Gagal menyalin');
    }
  };
  return (
    <button onClick={handleCopy} className="ml-3 px-2 py-1 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-700">
      Copy
    </button>
  );
}

/* ----------------- util ----------------- */
function formatAddress(user: User & { role: Role }) {
  const parts = [user.address, user.kelurahan, user.kecamatan].filter(Boolean);
  return parts.length ? parts.join(', ') : '-';
}
