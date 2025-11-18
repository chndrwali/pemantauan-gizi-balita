'use client';

import { useState, useTransition } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { CardContent } from '@/components/ui/card';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon } from 'lucide-react';

import { useTRPC } from '@/trpc/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import z from 'zod';
import { addTimbangSimpleSchema } from '@/lib/form-schema';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';

export function NumberInput({ value, onChange, placeholder }: { value?: number | null | undefined; onChange: (v: number | undefined) => void; placeholder?: string }) {
  return (
    <Input
      type="number"
      inputMode="decimal"
      placeholder={placeholder}
      value={value === undefined || value === null ? '' : String(value)}
      onChange={(e) => {
        const v = e.target.value;
        if (v === '') return onChange(undefined);
        const n = Number(v);
        onChange(Number.isFinite(n) ? n : undefined);
      }}
    />
  );
}

type AddTimbangValues = z.infer<typeof addTimbangSimpleSchema>;
const resolver = zodResolver(addTimbangSimpleSchema) as unknown as Resolver<AddTimbangValues>;

export const AddPengukuranForm = () => {
  const trpc = useTRPC();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { data: balitaList, isLoading: isBalitaLoading, refetch } = useQuery(trpc.balita.getManyBalita.queryOptions({ page: 1, limit: 100 }));

  const form = useForm<AddTimbangValues>({
    resolver,
    defaultValues: {
      balitaId: '',
      beratKg: undefined,
      tanggal: new Date(),
      lilaCm: undefined,
      lkCm: undefined,
      tinggiCm: undefined,
      catatan: '',
      source: 'PETUGAS',
    },
  });

  const mutate = useMutation(
    trpc.balita.addTimbang.mutationOptions({
      onSuccess: () => {
        form.reset();
        refetch();
        toast.success('Pengukuran di tambahkan');
      },
      onError: () => {
        toast.error('Terjadi Kesalahan');
      },
    })
  );

  const onSubmit = (values: AddTimbangValues) => {
    if ((values.beratKg === undefined || values.beratKg === null) && (values.tinggiCm === undefined || values.tinggiCm === null)) {
      form.setError('beratKg', { message: 'Minimal berat atau tinggi harus diisi' });
      form.setError('tinggiCm', { message: 'Minimal berat atau tinggi harus diisi' });
      return;
    }
    startTransition(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mutate.mutate(values as any);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Balita select */}
          <FormField
            control={form.control}
            name="balitaId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Balita</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={(v) => field.onChange(v)}>
                    <SelectTrigger>
                      <SelectValue placeholder={isBalitaLoading ? 'Memuat...' : 'Pilih balita'} />
                    </SelectTrigger>
                    <SelectContent>
                      {balitaList?.items?.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.nama} — {b.kecamatan ?? ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tanggal */}
          <FormField
            control={form.control}
            name="tanggal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tanggal</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !field.value && 'text-muted-foreground')}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, 'd MMMM yyyy', { locale: localeId }) : 'Pilih tanggal'}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Berat */}
          <FormField
            control={form.control}
            name="beratKg"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Berat (kg)</FormLabel>
                <FormControl>
                  <NumberInput value={field.value} onChange={(v) => field.onChange(v)} placeholder="Contoh: 3.2" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tinggi */}
          <FormField
            control={form.control}
            name="tinggiCm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tinggi (cm)</FormLabel>
                <FormControl>
                  <NumberInput value={field.value} onChange={(v) => field.onChange(v)} placeholder="Contoh: 50" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* LILA */}
          <FormField
            control={form.control}
            name="lilaCm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LILA (cm) — opsional</FormLabel>
                <FormControl>
                  <NumberInput value={field.value} onChange={(v) => field.onChange(v)} placeholder="Contoh: 10.5" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* LK */}
          <FormField
            control={form.control}
            name="lkCm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lingkar Kepala (cm) — opsional</FormLabel>
                <FormControl>
                  <NumberInput value={field.value} onChange={(v) => field.onChange(v)} placeholder="Contoh: 34.2" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Source */}
          <FormField
            control={form.control}
            name="source"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sumber</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={(v) => field.onChange(v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih sumber" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PETUGAS">PETUGAS</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Catatan */}
          <FormField
            control={form.control}
            name="catatan"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Catatan (opsional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Catatan singkat..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Advanced toggle */}
          <div className="md:col-span-2">
            <Button type="button" variant="ghost" onClick={() => setShowAdvanced((s) => !s)}>
              {showAdvanced ? 'Sembunyikan pengaturan lanjutan' : 'Tampilkan pengaturan lanjutan (LMS / mean/sd)'}
            </Button>

            {showAdvanced && (
              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* LMS WFA */}
                <div className="space-y-2">
                  <div className="text-sm font-medium">LMS WFA (opsional)</div>
                  <div className="grid grid-cols-3 gap-2">
                    <FormField
                      control={form.control}
                      name="lms.wfa.L"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="number" placeholder="L" onChange={(e) => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lms.wfa.M"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="number" placeholder="M" onChange={(e) => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lms.wfa.S"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="number" placeholder="S" onChange={(e) => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* MeanSd WFA */}
                <div className="space-y-2">
                  <div className="text-sm font-medium">Mean/SD WFA (opsional)</div>
                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={form.control}
                      name="meanSd.wfa.mean"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="number" placeholder="mean" onChange={(e) => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="meanSd.wfa.sd"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="number" placeholder="sd" onChange={(e) => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* spare column for other refs (hfa/wfh) */}
                <div className="space-y-2">
                  <div className="text-sm font-medium">Lainnya (opsional)</div>
                  <div className="text-xs text-muted-foreground">Isi hanya jika perlu (hfa / wfh)</div>
                </div>
              </div>
            )}
          </div>
        </CardContent>

        <div className="flex items-center px-6 justify-end gap-2">
          <Button variant="outline" type="button" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit"> {isPending ? <Spinner /> : 'Simpan'}</Button>
        </div>
      </form>
    </Form>
  );
};
