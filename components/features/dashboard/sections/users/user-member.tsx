'use client';

import React from 'react';
import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface Props {
  id: string;
}

const LOGO_SRC = '/logo/logo.png';

export const UserMemberCard = ({ id }: Props) => {
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(trpc.usersAdmin.getByID.queryOptions({ id }, { enabled: !!id }));

  const user = data?.user;
  const isStaff = user?.role === 'KADER' || user?.role === 'PETUGAS';
  const cardRef = React.useRef<HTMLDivElement | null>(null);

  if (isLoading)
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner />
      </div>
    );

  if (!user) return <div className="p-4 text-center text-sm text-muted-foreground">Pengguna tidak ditemukan.</div>;

  const fullAddress = [user.address ?? '', user.kelurahan ?? '', user.kecamatan ?? ''].filter(Boolean).join(', ');

  const printHtmlFor = (htmlFragment: string) => {
    // ambil semua style/link dari halaman saat ini supaya Tailwind tetap tersedia di jendela print
    const headStyles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
      .map((el) => el.outerHTML)
      .join('\n');

    const extra = `
      <style>
        html, body {
        height: 100%;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        margin: 0;
        padding: 0;
      }
        /* wrapper agar background gradient muncul di halaman print/preview */
        .print-wrapper {
          display:flex;
          align-items:center;
          justify-content:center;
          padding:12px;
          min-height:100vh;
          background: linear-gradient(135deg, #00b4d8, #00c48c);
        }
        @media print {
          body { margin:0; }
          .print-wrapper { background: linear-gradient(135deg, #00b4d8, #00c48c); }
          /* hapus shadow/border kalau mau lebih 'print-friendly' */
          .shadow-xl, .shadow-lg { box-shadow: none !important; }
        }
      </style>
    `;

    return `
      <html>
        <head>
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          ${headStyles}
          ${extra}
        </head>
        <body>
          <div class="print-wrapper">
            ${htmlFragment}
          </div>
        </body>
      </html>
    `;
  };

  const handlePrint = () => {
    if (!cardRef.current) return;
    const w = window.open('', '_blank');
    if (!w) return;
    // gunakan outerHTML apa adanya (Tailwind classes tetap ada)
    const html = printHtmlFor(cardRef.current.outerHTML);
    w.document.open();
    w.document.write(html);
    w.document.close();

    // tunggu sampai resources (css) dimuat sebelum print
    const tryPrint = () => {
      try {
        w.focus();
        w.print();
        // w.close(); // optional: jangan auto-close kalau mau user lihat preview
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        // kalau gagal, coba lagi setelah sebentar
        setTimeout(tryPrint, 200);
      }
    };

    // kasih sedikit waktu untuk load stylesheet, lalu print
    setTimeout(tryPrint, 300);
  };

  const Card = (
    <div ref={cardRef} className="rounded-xl shadow-xl border-2 border-white/30 w-[520px] h-[300px] overflow-hidden text-white bg-linear-to-br from-sky-600 to-emerald-500">
      <div className="flex h-full">
        {/* LEFT */}
        <div className="w-40 shrink-0 border-r border-white/30 p-4 flex flex-col items-center justify-center">
          <div className="w-24 h-24 rounded-md bg-white/20 flex items-center justify-center text-3xl font-semibold text-white">
            {user.name
              ? user.name
                  .split(' ')
                  .map((s) => s[0])
                  .slice(0, 2)
                  .join('')
              : '?'}
          </div>

          <div className="mt-3 text-center">
            <div className="text-sm font-medium text-white/90">{user.username ? `@${user.username}` : user.email ?? '-'}</div>
            {user.role && (
              <div
                className={`
        inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold uppercase
        ${
          user.role === 'KADER'
            ? 'bg-sky-400 text-white shadow-sm'
            : user.role === 'PETUGAS'
            ? 'bg-amber-400 text-emerald-900 shadow-sm'
            : user.role === 'ORANGTUA'
            ? 'bg-emerald-500 text-white shadow-sm'
            : 'bg-slate-200 text-slate-800 shadow-sm'
        }
      `}
              >
                {user.role}
              </div>
            )}
          </div>

          <Image
            src={LOGO_SRC}
            alt="Logo"
            className="mt-3 w-20 h-10 object-contain"
            width={80}
            height={40}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>

        {/* RIGHT */}
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs text-white/80">NIK</div>
                <div className="text-base font-semibold">{user.nik ?? '-'}</div>
              </div>

              <div className="text-right">
                {isStaff && (
                  <>
                    <div className="text-xs text-white/80">No. SIP</div>
                    <div className="text-base font-semibold">{user.nomorSIP ?? '-'}</div>
                  </>
                )}
              </div>
            </div>

            <div className="mt-3">
              <div className="text-xs text-white/80">Nama</div>
              <div className="text-lg font-bold text-white">{user.name ?? '-'}</div>
            </div>

            <div className="mt-3">
              <div className="text-xs text-white/80">Alamat</div>
              <div className="text-sm leading-snug mt-1">{fullAddress || '-'}</div>
              <div className="text-xs text-white/80 mt-2">
                RT / RW: <span className="font-medium">{user.rt ?? '-'}</span> / <span className="font-medium">{user.rw ?? '-'}</span>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div>
              <div className="text-xs text-white/80">Kontak</div>
              <div className="text-sm">{user.phone ?? '-'}</div>
              <div className="text-xs text-white/80 mt-1">{user.email ?? '-'}</div>
            </div>

            {isStaff ? (
              <div className="text-right">
                <div className="text-xs text-white/80">Kode Wilayah</div>
                <div className="text-base font-semibold">{user.kodeWilayah ?? '-'}</div>
              </div>
            ) : (
              <div />
            )}
          </div>

          <div className="text-xs text-white/70 mt-3 flex justify-between">
            <div>Dikeluarkan oleh Puskesmas Sukawarna</div>
            <div>{new Date().toLocaleDateString('id-ID')}</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-end justify-end print:hidden">
        <Button variant="secondary" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handlePrint}>
          Cetak / Download
        </Button>
      </div>

      <div className="flex justify-center">
        <div style={{ width: 520 }}>{Card}</div>
      </div>
    </div>
  );
};
