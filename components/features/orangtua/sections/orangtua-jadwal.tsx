'use client';

import React from 'react';
import { Plus, Bell, DownloadCloud } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

// // Mock types
// type Child = { id: string; name: string };
// type ScheduleItem = {
//   id: string;
//   childId: string;
//   date: string; // ISO
//   time?: string; // HH:MM
//   type: string; // vaksin name
//   location?: string;
//   reminder?: boolean;
// };

// interface Props {
//   childrenList?: Child[];
//   schedules?: ScheduleItem[];
// }

// { childrenList = [], schedules = [] }: Props

export const OrangTuaJadwalSection = () => {
  //   const [children] = React.useState<Child[]>(childrenList.length ? childrenList : [{ id: 'c1', name: 'Ahmad' }]);
  //   const [items, setItems] = React.useState<ScheduleItem[]>(
  //     schedules.length
  //       ? schedules
  //       : [
  //           { id: 's1', childId: 'c1', date: '2025-11-20', time: '09:00', type: 'Immunisasi DPT', location: 'Posyandu RW01', reminder: true },
  //           { id: 's2', childId: 'c1', date: '2025-12-10', time: '10:00', type: 'Immunisasi Polio', location: 'Puskesmas Sukawarna', reminder: false },
  //         ]
  //   );

  //   const [selectedChild, setSelectedChild] = React.useState<string>(children[0]?.id ?? '');

  //   // sheet form
  //   const [editing, setEditing] = React.useState<ScheduleItem | null>(null);
  //   const [form, setForm] = React.useState({ childId: selectedChild, date: '', time: '', type: '', location: '', reminder: true });

  //   React.useEffect(() => {
  //     if (!selectedChild && children.length) setSelectedChild(children[0].id);
  //   }, [children, selectedChild]);

  //   const openAdd = () => {
  //     setEditing(null);
  //     setForm({ childId: selectedChild, date: new Date().toISOString().slice(0, 10), time: '', type: '', location: '', reminder: true });
  //   };

  //   const openEdit = (s: ScheduleItem) => {
  //     setEditing(s);
  //     setForm({ childId: s.childId, date: s.date.slice(0, 10), time: s.time ?? '', type: s.type, location: s.location ?? '', reminder: !!s.reminder });
  //   };

  //   const handleSubmit = (e?: React.FormEvent) => {
  //     e?.preventDefault();
  //     if (!form.date || !form.type) {
  //       toast('Tanggal dan jenis imunisasi wajib');
  //       return;
  //     }

  //     if (editing) {
  //       setItems((prev) => prev.map((p) => (p.id === editing.id ? { ...p, ...editingFromForm(form, editing.id) } : p)));
  //       toast('Jadwal diperbarui');
  //     } else {
  //       const id = String(Date.now());
  //       setItems((prev) => [
  //         ...prev,
  //         { id, childId: form.childId, date: form.date, time: form.time || undefined, type: form.type, location: form.location || undefined, reminder: !!form.reminder },
  //       ]);
  //       toast('Jadwal ditambahkan');
  //     }
  //   };

  //   const handleDelete = (id: string) => {
  //     if (!confirm('Hapus jadwal?')) return;
  //     setItems((prev) => prev.filter((i) => i.id !== id));
  //     toast('Jadwal dihapus');
  //   };

  //   const upcoming = items
  //     .filter((i) => new Date(i.date).getTime() >= new Date().setHours(0, 0, 0, 0))
  //     .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  //     .slice(0, 6);

  //   const childItems = items.filter((i) => i.childId === selectedChild).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Jadwal Imunisasi</h1>
          <div className="text-sm text-slate-500">Lihat jadwal mendatang & tambah pengingat</div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <Label>Filter Anak</Label>
            {/* <select value={selectedChild} onChange={(e) => setSelectedChild(e.target.value)} className="rounded-md border p-2">
              {children.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select> */}
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button onClick={() => {}} className="inline-flex items-center gap-2">
                <Plus className="h-4 w-4" /> Tambah Jadwal
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-full max-w-md">
              <SheetHeader>
                <SheetTitle>
                  {/* {editing ? 'Edit Jadwal' : 'Tambah Jadwal'} */}
                  Tambah Jadwal
                </SheetTitle>
              </SheetHeader>

              <form className="mt-4 space-y-3" onSubmit={() => {}}>
                <div>
                  <Label>Anak</Label>
                  {/* <select value={form.childId} onChange={(e) => setForm((s) => ({ ...s, childId: e.target.value }))} className="w-full rounded-md border p-2">
                    {children.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select> */}
                </div>

                <div>
                  <Label>Tanggal</Label>
                  {/* <Input type="date" value={form.date} onChange={(e) => setForm((s) => ({ ...s, date: e.target.value }))} /> */}
                </div>

                <div>
                  <Label>Waktu (opsional)</Label>
                  {/* <Input type="time" value={form.time} onChange={(e) => setForm((s) => ({ ...s, time: e.target.value }))} /> */}
                </div>

                <div>
                  <Label>Jenis Imunisasi</Label>
                  {/* <Input value={form.type} onChange={(e) => setForm((s) => ({ ...s, type: e.target.value }))} placeholder="Contoh: DPT, Polio, Hepatitis" /> */}
                </div>

                <div>
                  <Label>Lokasi</Label>
                  {/* <Input value={form.location} onChange={(e) => setForm((s) => ({ ...s, location: e.target.value }))} placeholder="Contoh: Posyandu RW01" /> */}
                </div>

                <div className="flex items-center gap-2">
                  {/* <input id="reminder" type="checkbox" checked={!!form.reminder} onChange={(e) => setForm((s) => ({ ...s, reminder: e.target.checked }))} /> */}
                  <label htmlFor="reminder" className="text-sm text-slate-600">
                    Aktifkan pengingat
                  </label>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <Button type="submit" className="flex-1">
                    {/* {editing ? 'Simpan' : 'Tambah'} */}
                    Simpan
                  </Button>
                  {/* <Button variant="outline" onClick={() => setForm({ childId: selectedChild, date: new Date().toISOString().slice(0, 10), time: '', type: '', location: '', reminder: true })}> */}
                  <Button>Reset</Button>
                </div>
              </form>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Card className="p-4 mb-4">
            <div className="flex items-center justify-between">
              {/* <div className="text-sm font-medium">Jadwal untuk: <span className="font-semibold">{children.find((c) => c.id === selectedChild)?.name ?? '-'}</span></div> */}
              <div className="text-xs text-slate-500">
                Total:
                {/* {childItems.length} */}1
              </div>
            </div>
          </Card>

          {/* {childItems.length === 0 ? (
            <Card className="p-6 text-center">
              <div className="text-sm text-slate-500">Belum ada jadwal untuk anak ini.</div>
              <div className="mt-3">
                <Button onClick={openAdd}>
                  <Plus className="h-4 w-4 mr-2" /> Tambah Jadwal
                </Button>
              </div>
            </Card>
          ) : (
            childItems.map((it) => (
              <Card key={it.id} className="p-4 mb-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{it.type}</div>
                  <div className="text-xs text-slate-500 mt-1">{new Date(it.date).toLocaleDateString('id-ID')} {it.time ? `• ${it.time}` : ''}</div>
                  <div className="text-xs text-slate-500 mt-1">{it.location ?? 'Lokasi belum diisi'}</div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => openEdit(it)}>
                      <Bell className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" onClick={() => handleDelete(it.id)}>
                      Hapus
                    </Button>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{it.reminder ? 'Pengingat aktif' : 'Tanpa pengingat'}</div>
                </div>
              </Card>
            ))
          )} */}
        </div>

        <aside>
          <Card className="p-3 mb-4">
            <div className="text-sm font-medium">Upcoming</div>
            <div className="mt-3 space-y-2">
              {/* {upcoming.length === 0 ? (
                <div className="text-xs text-slate-500">Tidak ada jadwal mendatang</div>
              ) : (
                upcoming.map((u) => (
                  <div key={u.id} className="flex items-center justify-between bg-slate-50 p-2 rounded-md">
                    <div>
                      <div className="text-sm font-medium">{u.type}</div>
                      <div className="text-xs text-slate-500">{new Date(u.date).toLocaleDateString('id-ID')} {u.time ? `• ${u.time}` : ''}</div>
                    </div>
                    <div className="text-xs text-emerald-600">{children.find((c) => c.id === u.childId)?.name ?? '-'}</div>
                  </div>
                ))
              )} */}
            </div>

            <div className="mt-3">
              <Button variant="outline" className="flex items-center gap-2">
                <DownloadCloud className="h-4 w-4" /> Export
              </Button>
            </div>
          </Card>

          <Card className="p-3">
            <div className="text-sm font-medium">Tips Persiapan</div>
            <ul className="text-xs text-slate-600 list-disc pl-4 mt-2">
              <li>Datang 10 menit lebih awal</li>
              <li>Siapkan kartu imunisasi & KTP</li>
              <li>Hubungi petugas jika batuk/flu</li>
            </ul>
          </Card>
        </aside>
      </div>
    </div>
  );
};

// function editingFromForm(form: any, id?: string): ScheduleItem {
//   return {
//     id: id ?? String(Date.now()),
//     childId: form.childId,
//     date: form.date,
//     time: form.time || undefined,
//     type: form.type,
//     location: form.location || undefined,
//     reminder: !!form.reminder,
//   };
// }
