'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Edit2, Trash2, Plus, DownloadCloud } from 'lucide-react';
import { toast } from 'sonner';

// Mock types for child & records
// type Child = {
//   id: string;
//   name: string;
//   dob: string;
// };

// type RecordItem = {
//   id: string;
//   childId: string;
//   date: string; // ISO
//   weight?: number; // kg
//   height?: number; // cm
//   note?: string;
// };

// interface Props {
//   childrenList?: Child[];
//   recordsList?: RecordItem[];
// }

// { childrenList = [], recordsList = [] }: Props

export const OrangTuaCatatanSection = () => {
  //   const [children] = React.useState<Child[]>(childrenList.length ? childrenList : [{ id: 'c1', name: 'Ahmad', dob: '2022-01-12' }]);
  //   const [records, setRecords] = React.useState<RecordItem[]>(
  //     recordsList.length
  //       ? recordsList
  //       : [
  //           { id: 'r1', childId: 'c1', date: '2025-10-01', weight: 8.2, height: 70, note: 'Sehat, aktif' },
  //           { id: 'r2', childId: 'c1', date: '2025-08-01', weight: 7.9, height: 68, note: 'Naik 300g' },
  //         ]
  //   );

  //   const [selectedChild, setSelectedChild] = React.useState<string>(children[0]?.id ?? '');

  //   // sheet form state
  //   const [editing, setEditing] = React.useState<RecordItem | null>(null);
  //   const [form, setForm] = React.useState({ date: '', weight: '', height: '', note: '' });

  //   React.useEffect(() => {
  //     if (!selectedChild && children.length) setSelectedChild(children[0].id);
  //   }, [children, selectedChild]);

  //   const openAdd = () => {
  //     setEditing(null);
  //     setForm({ date: new Date().toISOString().slice(0, 10), weight: '', height: '', note: '' });
  //   };

  //   const openEdit = (r: RecordItem) => {
  //     setEditing(r);
  //     setForm({ date: r.date.slice(0, 10), weight: r.weight ? String(r.weight) : '', height: r.height ? String(r.height) : '', note: r.note ?? '' });
  //   };

  //   const handleSubmit = (e?: React.FormEvent) => {
  //     e?.preventDefault();
  //     if (!form.date) {
  //       toast('Tanggal wajib diisi');
  //       return;
  //     }
  //     if (!selectedChild) {
  //       toast('Pilih anak terlebih dahulu');
  //       return;
  //     }

  //     if (editing) {
  //       setRecords((prev) => prev.map((p) => (p.id === editing.id ? { ...p, date: form.date, weight: form.weight ? Number(form.weight) : undefined, height: form.height ? Number(form.height) : undefined, note: form.note } : p)));
  //       toast('Catatan diperbarui');
  //     } else {
  //       const id = String(Date.now());
  //       const newRec: RecordItem = { id, childId: selectedChild, date: form.date, weight: form.weight ? Number(form.weight) : undefined, height: form.height ? Number(form.height) : undefined, note: form.note };
  //       setRecords((prev) => [newRec, ...prev]);
  //       toast('Catatan ditambahkan');
  //     }
  //   };

  //   const handleDelete = (id: string) => {
  //     if (!confirm('Hapus catatan?')) return;
  //     setRecords((prev) => prev.filter((r) => r.id !== id));
  //     toast('Catatan dihapus');
  //   };

  //   const selectedRecords = records.filter((r) => r.childId === selectedChild).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Catatan Balita</h1>
          <div className="text-sm text-slate-500">Lihat & catat pertumbuhan anak Anda</div>
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
                <Plus className="h-4 w-4" /> Tambah Catatan
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-full max-w-md">
              <SheetHeader>
                <SheetTitle>
                  {/* {editing ? 'Edit Catatan' : 'Tambah Catatan'} */}
                  Tambah Catatan
                </SheetTitle>
              </SheetHeader>

              <form className="mt-4 space-y-3" onSubmit={() => {}}>
                <div>
                  <Label>Tanggal</Label>
                  {/* <Input type="date" value={form.date} onChange={(e) => setForm((s) => ({ ...s, date: e.target.value }))} /> */}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Berat (kg)</Label>
                    {/* <Input value={form.weight} onChange={(e) => setForm((s) => ({ ...s, weight: e.target.value }))} /> */}
                  </div>
                  <div>
                    <Label>Tinggi (cm)</Label>
                    {/* <Input value={form.height} onChange={(e) => setForm((s) => ({ ...s, height: e.target.value }))} /> */}
                  </div>
                </div>

                <div>
                  <Label>Catatan</Label>
                  {/* <Textarea value={form.note} onChange={(e) => setForm((s) => ({ ...s, note: e.target.value }))} /> */}
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <Button type="submit" className="flex-1">
                    {/* {editing ? 'Simpan' : 'Tambah'} */} Simpan
                  </Button>
                  {/* <Button variant="outline" onClick={() => setForm({ date: '', weight: '', height: '', note: '' })}> */}
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
              {/* <div className="text-sm font-medium">Catatan untuk: <span className="font-semibold">{children.find((c) => c.id === selectedChild)?.name ?? '-'}</span></div> */}
              {/* <div className="text-xs text-slate-500">Total: {selectedRecords.length}</div> */}
            </div>
          </Card>

          {/* {selectedRecords.length === 0 ? (
            <Card className="p-6 text-center">
              <div className="text-sm text-slate-500">Belum ada catatan untuk anak ini.</div>
            </Card>
          ) : (
            selectedRecords.map((r) => (
              <Card key={r.id} className="p-4 mb-3 flex items-start justify-between">
                <div>
                  <div className="text-sm font-medium">{new Date(r.date).toLocaleDateString('id-ID')}</div>
                  <div className="text-xs text-slate-500 mt-1">{r.weight ? `${r.weight} kg` : '-'} • {r.height ? `${r.height} cm` : '-'}</div>
                  {r.note && <div className="mt-2 text-sm text-slate-700">{r.note}</div>}
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => openEdit(r)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" onClick={() => handleDelete(r.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )} */}
        </div>

        <aside>
          <Card className="p-3 mb-4">
            <div className="text-sm font-medium">Ringkasan Terbaru</div>
            {/* <div className="mt-3 text-sm text-slate-700">Berat terakhir: {selectedRecords[0]?.weight ?? '-'} kg</div> */}
            {/* <div className="text-xs text-slate-500 mt-1">Tinggi terakhir: {selectedRecords[0]?.height ?? '-'} cm</div> */}
            <div className="mt-3">
              <Button variant="outline" className="flex items-center gap-2">
                <DownloadCloud className="h-4 w-4" /> Export CSV
              </Button>
            </div>
          </Card>

          <Card className="p-3">
            <div className="text-sm font-medium">Tips Kesehatan</div>
            <ul className="text-xs text-slate-600 list-disc pl-4 mt-2">
              <li>Catat berat & tinggi setiap kunjungan</li>
              <li>Berikan ASI eksklusif sampai 6 bulan (jika memungkinkan)</li>
              <li>Konsultasi ke petugas jika kenaikan berat tidak sesuai</li>
            </ul>
          </Card>
        </aside>
      </div>
    </div>
  );
};
