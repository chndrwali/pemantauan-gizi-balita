'use client';

import React from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

// Mock type — replace with real prisma types when wiring
// type Child = {
//   id: string;
//   name: string;
//   dob: string; // ISO
//   gender?: 'L' | 'P';
//   birthPlace?: string;
//   weight?: number;
//   height?: number;
// };

// interface Props {
//   childrenList?: Child[];
// }

// { childrenList = [] }: Props

export const OrangTuaAnakSection = () => {
  //   const [children, setChildren] = React.useState<Child[]>(childrenList);
  //   const [editing, setEditing] = React.useState<Child | null>(null);

  // form state for add/edit
  const [form, setForm] = React.useState({ name: '', dob: '', gender: 'L', birthPlace: '', weight: '', height: '' });

  //   const openAdd = () => {
  //     setEditing(null);
  //     setForm({ name: '', dob: '', gender: 'L', birthPlace: '', weight: '', height: '' });
  //   };

  //   const openEdit = (c: Child) => {
  //     setEditing(c);
  //     setForm({ name: c.name, dob: c.dob.slice(0, 10), gender: c.gender ?? 'L', birthPlace: c.birthPlace ?? '', weight: String(c.weight ?? ''), height: String(c.height ?? '') });
  //   };

  //   const handleSubmit = (e?: React.FormEvent) => {
  //     e?.preventDefault();
  //     if (!form.name || !form.dob) {
  //       toast('Nama dan tanggal lahir wajib');
  //       return;
  //     }

  //     if (editing) {
  //       setChildren((prev) => prev.map((p) => (p.id === editing.id ? { ...p, ...editingFromForm(form) } : p)));
  //       toast('Data anak diperbarui');
  //     } else {
  //       const id = String(Date.now());
  //       setChildren((prev) => [...prev, { id, ...editingFromForm(form) }]);
  //       toast('Anak berhasil ditambahkan');
  //     }
  //   };

  //   const handleDelete = (id: string) => {
  //     if (!confirm('Hapus data anak?')) return;
  //     setChildren((prev) => prev.filter((c) => c.id !== id));
  //     toast('Data anak dihapus');
  //   };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Daftar Anak</h1>
          <div className="text-sm text-slate-500">Kelola data balita keluarga Anda</div>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button onClick={() => {}} className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" /> Tambah Anak
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="w-full max-w-md">
            <SheetHeader>
              <SheetTitle>
                {/* {editing ? 'Edit Anak' : 'Tambah Anak'} */}
                Tambah Anak
              </SheetTitle>
            </SheetHeader>

            <form
              onSubmit={() => {
                // handleSubmit(e);
              }}
              className="mt-4 space-y-3"
            >
              <div>
                <Label>Nama</Label>
                <Input value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />
              </div>

              <div>
                <Label>Tanggal Lahir</Label>
                <Input type="date" value={form.dob} onChange={(e) => setForm((s) => ({ ...s, dob: e.target.value }))} />
              </div>

              <div>
                <Label>Jenis Kelamin</Label>
                <select value={form.gender} onChange={(e) => setForm((s) => ({ ...s, gender: e.target.value }))} className="w-full rounded-md border p-2">
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>

              <div>
                <Label>Tempat Lahir</Label>
                <Input value={form.birthPlace} onChange={(e) => setForm((s) => ({ ...s, birthPlace: e.target.value }))} />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Berat (kg)</Label>
                  <Input value={form.weight} onChange={(e) => setForm((s) => ({ ...s, weight: e.target.value }))} />
                </div>
                <div>
                  <Label>Tinggi (cm)</Label>
                  <Input value={form.height} onChange={(e) => setForm((s) => ({ ...s, height: e.target.value }))} />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <Button type="submit" className="flex-1">
                  {/* {editing ? 'Simpan' : 'Tambah'} */}
                  Simpan
                </Button>
                <Button variant="outline" onClick={() => setForm({ name: '', dob: '', gender: 'L', birthPlace: '', weight: '', height: '' })}>
                  Reset
                </Button>
              </div>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* {children.length === 0 ? (
          <Card className="p-6 text-center">
            <div className="text-sm text-slate-500">Belum ada anak terdaftar.</div>
            <div className="mt-3">
              <Button onClick={openAdd}>
                <Plus className="h-4 w-4 mr-2" /> Tambah Anak
              </Button>
            </div>
          </Card>
        ) : (
          children.map((c) => (
            <Card key={c.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>
                    {c.name
                      .split(' ')
                      .map((s) => s[0])
                      .slice(0, 2)
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium">{c.name}</div>
                  <div className="text-xs text-slate-500">
                    {new Date(c.dob).toLocaleDateString('id-ID')} • {c.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{c.weight ? `${c.weight} kg • ${c.height} cm` : 'Belum ada data berat/tinggi'}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => openEdit(c)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(c.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))
        )} */}
      </div>

      {/* optional: detailed view / growth chart placeholder for selected child */}
      <Separator className="my-6" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 md:col-span-2">
          <div className="text-sm font-medium mb-3">Pertumbuhan & Catatan</div>
          <div className="text-xs text-slate-500">Pilih anak untuk lihat detail lengkap (placeholder)</div>
          <div className="mt-4 text-sm text-slate-700">Grafik pertumbuhan akan muncul di sini.</div>
        </Card>

        <Card className="p-4">
          <div className="text-sm font-medium mb-3">Tips Singkat</div>
          <ul className="text-xs text-slate-600 list-disc pl-4">
            <li>Pastikan imunisasi sesuai jadwal</li>
            <li>Catat berat & tinggi setiap kunjungan</li>
            <li>Hubungi petugas jika ada keluhan</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

// function editingFromForm(form: any): Partial<Child> {
//   return {
//     name: form.name,
//     dob: form.dob,
//     gender: form.gender,
//     birthPlace: form.birthPlace,
//     weight: form.weight ? Number(form.weight) : undefined,
//     height: form.height ? Number(form.height) : undefined,
//   };
// }
