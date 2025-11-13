'use client';

import React from 'react';
import { Plus, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

// Mock types
// type Child = { id: string; name: string };
// type Appointment = {
//   id: string;
//   childId: string;
//   date: string; // ISO
//   time?: string; // HH:MM
//   venue: string; // posyandu/puskesmas name
//   address?: string;
//   status?: 'scheduled' | 'done' | 'cancelled';
// };

// interface Props {
//   childrenList?: Child[];
//   appointments?: Appointment[];
// }

// { childrenList = [], appointments = [] }: Props

export const OrangTuaJanjiSection = () => {
  //   const [children] = React.useState<Child[]>(childrenList.length ? childrenList : [{ id: 'c1', name: 'Ahmad' }]);
  //   const [items, setItems] = React.useState<Appointment[]>(
  //     appointments.length
  //       ? appointments
  //       : [
  //           { id: 'a1', childId: 'c1', date: '2025-11-25', time: '08:30', venue: 'Posyandu RW01', address: 'Jl. Melati No. 12', status: 'scheduled' },
  //         ]
  //   );

  //   const [selectedChild, setSelectedChild] = React.useState<string>(children[0]?.id ?? '');

  //   const [editing, setEditing] = React.useState<Appointment | null>(null);
  //   const [form, setForm] = React.useState({ childId: selectedChild, date: '', time: '', venue: '', address: '' });

  //   React.useEffect(() => {
  //     if (!selectedChild && children.length) setSelectedChild(children[0].id);
  //   }, [children, selectedChild]);

  //   const openAdd = () => {
  //     setEditing(null);
  //     setForm({ childId: selectedChild, date: new Date().toISOString().slice(0, 10), time: '', venue: '', address: '' });
  //   };

  //   const openEdit = (a: Appointment) => {
  //     setEditing(a);
  //     setForm({ childId: a.childId, date: a.date.slice(0, 10), time: a.time ?? '', venue: a.venue, address: a.address ?? '' });
  //   };

  //   const handleSubmit = (e?: React.FormEvent) => {
  //     e?.preventDefault();
  //     if (!form.date || !form.venue) {
  //       toast('Tanggal dan lokasi wajib');
  //       return;
  //     }

  //     if (editing) {
  //       setItems((prev) => prev.map((p) => (p.id === editing.id ? { ...p, date: form.date, time: form.time || undefined, venue: form.venue, address: form.address || undefined } : p)));
  //       toast('Janji diperbarui');
  //     } else {
  //       const id = String(Date.now());
  //       setItems((prev) => [
  //         ...prev,
  //         { id, childId: form.childId, date: form.date, time: form.time || undefined, venue: form.venue, address: form.address || undefined, status: 'scheduled' },
  //       ]);
  //       toast('Janji dibuat');
  //     }
  //   };

  //   const handleCancel = (id: string) => {
  //     if (!confirm('Batalkan janji?')) return;
  //     setItems((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'cancelled' } : p)));
  //     toast('Janji dibatalkan');
  //   };

  //   const handleMarkDone = (id: string) => {
  //     setItems((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'done' } : p)));
  //     toast('Janji ditandai selesai');
  //   };

  //   const childAppointments = items.filter((i) => i.childId === selectedChild).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  //   const upcoming = items.filter((i) => i.status === 'scheduled' && new Date(i.date).getTime() >= new Date().setHours(0, 0, 0, 0)).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Posyandu / Janji</h1>
          <div className="text-sm text-slate-500">Daftar janji & posyandu terdekat</div>
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
                <Plus className="h-4 w-4" /> Buat Janji
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-full max-w-md">
              <SheetHeader>
                <SheetTitle>
                  Buat Janji
                  {/* {editing ? 'Edit Janji' : 'Buat Janji Baru'} */}
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
                  <Label>Posyandu / Lokasi</Label>
                  {/* <Input value={form.venue} onChange={(e) => setForm((s) => ({ ...s, venue: e.target.value }))} placeholder="Contoh: Posyandu RW01" /> */}
                </div>

                <div>
                  <Label>Alamat (opsional)</Label>
                  {/* <Input value={form.address} onChange={(e) => setForm((s) => ({ ...s, address: e.target.value }))} /> */}
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <Button type="submit" className="flex-1">
                    {/* {editing ? 'Simpan' : 'Buat'} */}
                    Simpan
                  </Button>
                  <Button variant="outline" onClick={() => {}}>
                    Reset
                  </Button>
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
              <div className="text-sm font-medium">
                Janji untuk: <span className="font-semibold">Candra</span>
              </div>
              <div className="text-xs text-slate-500">Total: 1</div>
            </div>
          </Card>

          {/* {childAppointments.length === 0 ? (
            <Card className="p-6 text-center">
              <div className="text-sm text-slate-500">Belum ada janji untuk anak ini.</div>
              <div className="mt-3">
                <Button onClick={openAdd}>
                  <Plus className="h-4 w-4 mr-2" /> Buat Janji
                </Button>
              </div>
            </Card>
          ) : (
            childAppointments.map((a) => (
              <Card key={a.id} className="p-4 mb-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{a.venue}</div>
                  <div className="text-xs text-slate-500 mt-1">{new Date(a.date).toLocaleDateString('id-ID')} {a.time ? `• ${a.time}` : ''}</div>
                  {a.address && <div className="text-xs text-slate-500 mt-1">{a.address}</div>}
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex gap-2">
                    {a.status === 'scheduled' && (
                      <>
                        <Button variant="ghost" onClick={() => openEdit(a)}>
                          <Calendar className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" onClick={() => handleMarkDone(a.id)}>
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" onClick={() => handleCancel(a.id)}>
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}

                    {a.status === 'done' && <div className="text-sm text-emerald-600">Selesai</div>}
                    {a.status === 'cancelled' && <div className="text-sm text-rose-600">Dibatalkan</div>}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{a.status === 'scheduled' ? 'Menunggu' : a.status}</div>
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
                      <div className="text-sm font-medium">{u.venue}</div>
                      <div className="text-xs text-slate-500">{new Date(u.date).toLocaleDateString('id-ID')} {u.time ? `• ${u.time}` : ''}</div>
                    </div>
                    <div className="text-xs text-emerald-600">{children.find((c) => c.id === u.childId)?.name ?? '-'}</div>
                  </div>
                ))
              )} */}
            </div>
          </Card>

          <Card className="p-3">
            <div className="text-sm font-medium">Cari Posyandu</div>
            <div className="mt-3 text-xs text-slate-500">Masukkan nama posyandu untuk mencari lokasi terdekat (placeholder)</div>
            <div className="mt-3 flex gap-2">
              <Input placeholder="Contoh: Posyandu RW01" />
              <Button>Search</Button>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
};
