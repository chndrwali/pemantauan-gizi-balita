'use client';

import React from 'react';
import { Role, User } from '@/lib/generated/prisma/client';
import { toast } from 'sonner';

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

export const ProfileUser = ({ user }: Props) => {
  if (!user)
    return (
      <div className="w-full max-w-3xl mx-auto p-6 rounded-lg border border-slate-100 bg-white shadow-sm text-center">
        <div className="text-sm text-slate-500">Pengguna tidak ditemukan.</div>
      </div>
    );

  const meta = roleMeta[user.role] ?? { label: (user.role as string) ?? 'UNKNOWN', bg: 'bg-slate-200', text: 'text-slate-800' };

  return (
    // wrapper adjusted to match sidebar: clean white card, subtle border & shadow
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
              {user.role !== 'ORANGTUA' && (
                <>
                  <InfoRow label="No. SIP" value={user.nomorSIP ?? '-'} />
                  <InfoRow label="Kode Wilayah" value={user.kodeWilayah ?? '-'} />
                </>
              )}

              {/* Small meta */}
              <div className="mt-2 text-xs text-slate-500">
                Role internal: <span className="font-medium text-slate-700">{meta.label}</span>
              </div>
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
      // minimal feedback (could be improved with toast)
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

function formatAddress(user: User & { role: Role }) {
  const parts = [user.address, user.kelurahan, user.kecamatan].filter(Boolean);
  return parts.length ? parts.join(', ') : '-';
}
