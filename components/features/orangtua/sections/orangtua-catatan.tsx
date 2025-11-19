'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Calendar, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useTRPC } from '@/trpc/client';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { DEFAULT_LIMIT } from '@/lib/utils';
import z from 'zod';
import { addCatatanSchema } from '@/lib/form-schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useMemo } from 'react';

type FormValues = z.infer<typeof addCatatanSchema>;

interface CatatanItem {
  id: string;
  title: string;
  text: string;
  createdAt: Date;
}

export const OrangTuaCatatanSection = () => {
  const trpc = useTRPC();

  const { data, refetch, isLoading } = useSuspenseQuery(trpc.orangtua.getCatatan.queryOptions({ limit: DEFAULT_LIMIT }));

  const catatan: CatatanItem[] = data.items;

  const stats = useMemo(() => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return {
      catatanMingguIni: catatan.filter((c) => new Date(c.createdAt) > oneWeekAgo).length,
    };
  }, [catatan]);

  const mutate = useMutation(
    trpc.orangtua.addCatatan.mutationOptions({
      onSuccess: () => {
        toast.success('Catatan berhasil ditambahkan');
        form.reset();
        refetch();
      },
      onError: () => {
        toast.error('Gagal menambah catatan');
      },
    })
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(addCatatanSchema),
    defaultValues: {
      text: '',
      title: '',
    },
  });

  const onSubmit = (values: FormValues) => {
    mutate.mutate(values);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - new Date(date).getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      return 'Baru saja';
    } else if (diffInHours < 24) {
      return `${diffInHours} jam yang lalu`;
    } else if (diffInDays === 1) {
      return 'Kemarin';
    } else if (diffInDays < 7) {
      return `${diffInDays} hari yang lalu`;
    } else {
      return formatDate(date);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-3">
            <FileText className="h-8 w-8 text-blue-600" />
            Catatan
          </h1>
          <p className="text-slate-600 mt-2">Buat catatan agar anda tidak mudah lupa</p>
        </div>

        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4" />
                Tambah Catatan
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle className="text-xl font-semibold">Tambah Catatan Baru</SheetTitle>
              </SheetHeader>

              <Form {...form}>
                <form className="mt-6 space-y-4 px-4" onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="title">Judul Catatan</Label>
                        <FormControl>
                          <Input {...field} placeholder="Contoh: Perkembangan bulan ke-6" className="w-full" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="text"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="text">Isi Catatan</Label>
                        <FormControl>
                          <Textarea {...field} placeholder="Tuliskan catatan perkembangan, keluhan, atau hal penting lainnya..." className="w-full min-h-[120px] resize-vertical" rows={5} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center gap-2 pt-4">
                    <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={mutate.isPending}>
                      {mutate.isPending ? 'Menyimpan...' : 'Simpan Catatan'}
                    </Button>
                  </div>
                </form>
              </Form>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center bg-blue-50 border-blue-200">
          <div className="text-2xl font-bold text-blue-900">{catatan.length}</div>
          <div className="text-sm text-blue-700">Total Catatan</div>
        </Card>
        <Card className="p-4 text-center bg-green-50 border-green-200">
          <div className="text-2xl font-bold text-green-900">{stats.catatanMingguIni}</div>
          <div className="text-sm text-green-700">Minggu Ini</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card className="p-6 shadow-sm">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-pulse text-lg">Memuat catatan...</div>
              </div>
            ) : catatan.length > 0 ? (
              <div className="space-y-4">
                {catatan.map((item) => (
                  <Card key={item.id} className="p-4 border border-slate-200 hover:border-blue-300 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                      </div>
                    </div>

                    <p className="text-slate-700 mb-4 leading-relaxed whitespace-pre-wrap">{item.text}</p>

                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(item.createdAt)}</span>
                        </div>
                        <span>•</span>
                        <span>{getRelativeTime(item.createdAt)}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg">
                <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Belum ada catatan</h3>
                <p className="text-slate-600 mb-6 max-w-md mx-auto">Mulai dengan menambahkan catatan pertama Anda untuk mencatat perkembangan anak.</p>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah Catatan Pertama
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-full sm:max-w-md">
                    <SheetHeader>
                      <SheetTitle className="text-xl font-semibold">Tambah Catatan Baru</SheetTitle>
                    </SheetHeader>

                    <Form {...form}>
                      <form className="mt-6 space-y-4 px-4" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <Label htmlFor="title">Judul Catatan</Label>
                              <FormControl>
                                <Input {...field} placeholder="Contoh: Perkembangan bulan ke-6" className="w-full" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="text"
                          render={({ field }) => (
                            <FormItem>
                              <Label htmlFor="text">Isi Catatan</Label>
                              <FormControl>
                                <Textarea {...field} placeholder="Tuliskan catatan perkembangan, keluhan, atau hal penting lainnya..." className="w-full min-h-[120px] resize-vertical" rows={5} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex items-center gap-2 pt-4">
                          <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={mutate.isPending}>
                            {mutate.isPending ? 'Menyimpan...' : 'Simpan Catatan'}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </SheetContent>
                </Sheet>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <Card className="p-5 bg-blue-50 border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Tips Membuat Catatan
            </h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>• Catat perkembangan fisik (berat, tinggi, gigi)</li>
              <li>• Tulis pencapaian motorik (merangkak, berjalan)</li>
              <li>• Catat pola makan dan kesulitan yang dialami</li>
              <li>• Tuliskan keluhan kesehatan atau alergi</li>
              <li>• Dokumentasi moment spesial pertama kali</li>
            </ul>
          </Card>

          <Card className="p-5 bg-green-50 border-green-200">
            <h3 className="font-semibold text-green-900 mb-3">Manfaat Mencatat</h3>
            <ul className="text-sm text-green-800 space-y-2">
              <li>• Memantau perkembangan secara teratur</li>
              <li>• Bahan konsultasi dengan dokter</li>
              <li>• Mengenali pola pertumbuhan anak</li>
              <li>• Dokumentasi kenangan berharga</li>
              <li>• Deteksi dini masalah kesehatan</li>
            </ul>
          </Card>

          <Card className="p-5 bg-amber-50 border-amber-200">
            <h3 className="font-semibold text-amber-900 mb-3">Pengingat</h3>
            <ul className="text-sm text-amber-800 space-y-2">
              <li>• Update catatan setiap bulan</li>
              <li>• Catat sebelum kunjungan posyandu</li>
              <li>• Simpan foto perkembangan</li>
              <li>• Bagikan dengan pasangan</li>
              <li>• Backup data secara berkala</li>
            </ul>
          </Card>
        </aside>
      </div>
    </div>
  );
};
