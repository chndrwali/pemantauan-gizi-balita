'use client';

import Link from 'next/link';
import { Calendar, Users, FileText, MessageSquare, DownloadCloud } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useCurrentUser } from '@/actions/auth-client';

// // Mock types (replace with real types / props when wiring up)
// type Child = {
//   id: string;
//   name: string;
//   dob: string; // ISO
//   gender?: 'L' | 'P';
//   nextImmunization?: string; // date
//   weight?: number; // kg
//   height?: number; // cm
// };

// interface Props {
//   user?: {
//     name?: string | null;
//     email?: string | null;
//     avatarUrl?: string | null;
//   } | null;
//   children?: Child[];
// }

export const OrangTuaSections = () => {
  const user = useCurrentUser();

  const initials = (user?.name || user?.email || 'U')
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // derive a "next immunization" by scanning children (placeholder logic)
  //   const nextImmun = children
  //     .map((c) => ({ ...c, next: c.nextImmunization ? new Date(c.nextImmunization) : null }))
  //     .filter((c) => c.next)
  //     .sort((a, b) => (a.next!.getTime() - b.next!.getTime()))[0];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      {/* Top summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <section className="col-span-1 md:col-span-1">
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">{user?.image ? <AvatarImage src={user.image} alt={user?.name ?? 'avatar'} /> : <AvatarFallback>{initials}</AvatarFallback>}</Avatar>

              <div className="flex-1">
                <div className="text-lg font-semibold text-slate-900">{user?.name ?? 'Orang Tua'}</div>
                <div className="text-sm text-slate-500">{user?.email ?? ''}</div>
                <div className="mt-2 text-xs text-slate-500">Ringkasan singkat keluarga</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-lg text-center">
                  <div className="text-xs text-slate-500">Jumlah Anak</div>
                  {/* <div className="text-lg font-semibold mt-1">{children.length}</div> */}
                </div>

                <div className="bg-slate-50 p-3 rounded-lg text-center">
                  <div className="text-xs text-slate-500">Imunisasi Berikutnya</div>
                  {/* <div className="text-lg font-semibold mt-1">{nextImmun ? nextImmun.next!.toLocaleDateString('id-ID') : '-'}</div> */}
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Link href="/orangtua/jadwal">
                  <Button variant="ghost" className="flex-1">
                    Lihat Jadwal
                  </Button>
                </Link>
                <Link href="/orangtua/anak">
                  <Button className="flex-1">Daftar Anak</Button>
                </Link>
              </div>
            </div>
          </Card>
        </section>

        {/* Middle: action grid & upcoming */}
        <section className="col-span-1 md:col-span-1">
          <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
            <Link href="/orangtua/jadwal">
              <Card className="p-3 hover:shadow">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-emerald-50">
                    <Calendar className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Jadwal Imunisasi</div>
                    <div className="text-xs text-slate-500">Cek jadwal dan reminder</div>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/orangtua/catatan">
              <Card className="p-3 hover:shadow">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-emerald-50">
                    <FileText className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Catatan Balita</div>
                    <div className="text-xs text-slate-500">Berat, tinggi & perkembangan</div>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/orangtua/janji">
              <Card className="p-3 hover:shadow">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-emerald-50">
                    <MessageSquare className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Posyandu / Janji</div>
                    <div className="text-xs text-slate-500">Daftar jadwal & lokasi</div>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/orangtua/anak">
              <Card className="p-3 hover:shadow">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-emerald-50">
                    <Users className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Daftar Anak</div>
                    <div className="text-xs text-slate-500">Kelola data anak</div>
                  </div>
                </div>
              </Card>
            </Link>
          </div>

          {/* upcoming immunization compact */}
          <div className="mt-4">
            <Card className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Imunisasi Berikutnya</div>
                  {/* <div className="text-xs text-slate-500">{nextImmun ? `${nextImmun.name ?? nextImmun.name} • ${nextImmun.next!.toLocaleDateString('id-ID')}` : 'Tidak ada jadwal'}</div> */}
                </div>
                <div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <DownloadCloud className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* RIGHT: children list & growth placeholder */}
        <section className="col-span-1 md:col-span-1">
          <Card className="p-3">
            <div className="text-sm font-medium mb-3">Anak-anak</div>
            <div className="space-y-3">
              {/* {children.length === 0 ? (
                <div className="text-xs text-slate-500">Belum ada anak terdaftar. Tambah data anak di halaman Daftar Anak.</div>
              ) : (
                children.map((c) => (
                  <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                    <div className="w-12 h-12 rounded-md bg-emerald-600 text-white flex items-center justify-center font-semibold">{c.name.split(' ').map(s => s[0]).slice(0,2).join('')}</div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{c.name}</div>
                      <div className="text-xs text-slate-500">{new Date(c.dob).toLocaleDateString('id-ID')} • {c.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</div>
                    </div>
                    <div className="text-sm text-emerald-600">{c.nextImmunization ? new Date(c.nextImmunization).toLocaleDateString('id-ID') : '—'}</div>
                  </div>
                ))
              )} */}
            </div>
          </Card>

          <Card className="p-3 mt-4">
            <div className="text-sm font-medium mb-2">Pertumbuhan (Preview)</div>
            <div className="text-xs text-slate-500 mb-2">Grafik singkat berat badan (placeholder)</div>
            <Progress value={40} />
            {/* <div className="mt-2 text-xs text-slate-500">Terakhir: {children[0]?.weight ? `${children[0].weight} kg` : '-'}</div> */}
          </Card>
        </section>
      </div>
    </div>
  );
};
