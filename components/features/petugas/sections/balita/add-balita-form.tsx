'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createBalitaSchema } from '@/lib/form-schema';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
// import { useEffect, useState } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import z from 'zod';
import { id } from 'date-fns/locale';
import { useTRPC } from '@/trpc/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTransition } from 'react';

type FormValues = z.infer<typeof createBalitaSchema>;
const resolver = zodResolver(createBalitaSchema) as unknown as Resolver<FormValues>;

export const AddBalitaForm = () => {
  const trpc = useTRPC();
  const [isPending, startTransition] = useTransition();

  const { data, isLoading, refetch } = useQuery(trpc.balita.getOrangTua.queryOptions({ role: 'ORANGTUA' }));
  const user = data;

  const mutate = useMutation(
    trpc.balita.createBalita.mutationOptions({
      onSuccess: () => {
        toast.success('Balita di tambahkan');
        refetch();
      },
      onError: () => {
        toast.error('Kesalahan');
      },
    })
  );

  const form = useForm<FormValues>({
    resolver,
    defaultValues: {
      aktif: undefined,
      nama: '',
      alamat: '',
      orangTuaId: '',
      anakKe: undefined,
      bbLahirKg: undefined,
      jenisKelamin: 'L',
      kecamatan: '',
      kelurahan: '',
      nikAnak: '',
      noKIA: '',
      tanggalLahir: undefined,
      tbLahirCm: undefined,
    },
  });

  const onSubmit = async (values: FormValues) => {
    startTransition(() => {
      mutate.mutate(values);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Nama */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 ">
          <div className="space-y-4 lg:col-span-3 ">
            <FormField
              control={form.control}
              name="nama"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Balita</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: Ahmad" {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Jenis Kelamin */}
            <FormField
              control={form.control}
              name="jenisKelamin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jenis Kelamin</FormLabel>
                  <FormControl>
                    <Select onValueChange={(v) => field.onChange(v)} value={field.value} disabled={isPending}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis kelamin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="L">Laki-laki</SelectItem>
                        <SelectItem value="P">Perempuan</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tanggalLahir"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal Lahir</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !field.value && 'text-muted-foreground')}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, 'd MMMM yyyy', { locale: id }) : 'Pilih tanggal lahir'}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date('1900-01-01')} initialFocus locale={id} />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Orang Tua (simple input; bisa diganti jadi Select yang fetch dari API) */}
            <FormField
              control={form.control}
              name="orangTuaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pilih User</FormLabel>
                  <FormControl>
                    <Select onValueChange={(v) => field.onChange(v)} value={field.value ?? undefined} disabled={isPending}>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoading ? 'Memuat...' : 'Pilih user'} />
                      </SelectTrigger>
                      <SelectContent>
                        {user?.length ? (
                          user.map((u) => (
                            <SelectItem key={u.id} value={u.id}>
                              {u.name} {u.email ? `• ${u.email}` : ''}
                            </SelectItem>
                          ))
                        ) : isLoading ? (
                          <SelectItem value="loading">Memuat...</SelectItem>
                        ) : (
                          <SelectItem value="">Tidak ada user</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Kontak orang tua tampil read-only / optional */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nikAnak"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIK Anak</FormLabel>
                    <FormControl>
                      <Input placeholder="NIK " {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="noKIA"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No KIA</FormLabel>
                    <FormControl>
                      <Input placeholder="No KIA (opsional)" {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex flex-col space-y-4 lg:col-span-2">
            {/* BB Lahir / TB Lahir */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="bbLahirKg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Berat Lahir (kg)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Contoh: 3.2"
                        value={field.value ?? ''}
                        onChange={(e) => {
                          const v = e.target.value;
                          field.onChange(v === '' ? undefined : parseFloat(v));
                        }}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tbLahirCm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tinggi Lahir (cm)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Contoh: 50"
                        value={field.value ?? ''}
                        onChange={(e) => {
                          const v = e.target.value;
                          field.onChange(v === '' ? undefined : parseInt(v, 10));
                        }}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="anakKe"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Anak ke-</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Contoh: 1"
                        value={field.value ?? ''}
                        onChange={(e) => {
                          const v = e.target.value;
                          field.onChange(v === '' ? undefined : parseInt(v, 10));
                        }}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Alamat / Kecamatan / Kelurahan */}
            <FormField
              control={form.control}
              name="alamat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat</FormLabel>
                  <FormControl>
                    <Input placeholder="Alamat lengkap" {...field} defaultValue={field.value ?? ''} value={field.value ?? ''} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="kecamatan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kecamatan</FormLabel>
                    <FormControl>
                      <Input placeholder="Kecamatan" {...field} defaultValue={field.value ?? ''} value={field.value ?? ''} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="kelurahan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kelurahan</FormLabel>
                    <FormControl>
                      <Input placeholder="Kelurahan" {...field} defaultValue={field.value ?? ''} value={field.value ?? ''} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Aktif select */}
            <FormField
              control={form.control}
              name="aktif"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status Aktif</FormLabel>
                  <FormControl>
                    <Select onValueChange={(v) => field.onChange(v === 'true')} value={String(field.value ?? true)} disabled={isPending}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Aktif</SelectItem>
                        <SelectItem value="false">Nonaktif</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* aksi tombol */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="outline" type="button" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit">Simpan</Button>
        </div>
      </form>
    </Form>
  );
};
