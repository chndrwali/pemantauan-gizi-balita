'use client';

import { z } from 'zod';
import { toast } from 'sonner';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormLabel, FormItem, FormMessage } from '@/components/ui/form';
import { Spinner } from '@/components/ui/spinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTransition } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { useTRPC } from '@/trpc/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { Resolver } from 'react-hook-form';

const formSchema = z
  .object({
    mode: z.enum(['single', 'all']).default('single'),
    role: z.enum(['KADER', 'ORANGTUA']).optional(),
    userId: z.string().uuid().optional(),
    title: z.string().min(1, 'Judul wajib diisi'),
    body: z.string().min(1, 'Pesan wajib diisi'),
    type: z.string().default('GENERAL'),
  })
  .superRefine((val, ctx) => {
    if (val.mode === 'single' && !val.userId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['userId'],
        message: 'Pilih user tujuan saat mode Single',
      });
    }
    if (val.mode === 'all' && !val.role) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['role'],
        message: 'Pilih role (KADER / ORANGTUA) untuk broadcast',
      });
    }
  });

type FormSchema = z.infer<typeof formSchema>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resolver = zodResolver(formSchema) as unknown as Resolver<FormSchema, any>;

export const NotificationFormPetugas = () => {
  const trpc = useTRPC();

  const sendNotification = useMutation(
    trpc.usersPetugas.sendNotification.mutationOptions({
      onSuccess: () => {
        toast.success('Notifikasi terkirim ke 1 user.');
      },
      onError: () => {
        toast.error('Gagal mengirim notifikasi');
      },
    })
  );
  const sendToAll = useMutation(
    trpc.usersPetugas.sendToAll.mutationOptions({
      onSuccess: () => {
        toast.success('Notifikasi terkirim ke seluruh kader dan orang tua');
      },
      onError: () => {
        toast.error('Gagal mengirim notifikasi');
      },
    })
  );

  const [isPending, startTransition] = useTransition();

  const form = useForm<FormSchema>({
    resolver,
    defaultValues: {
      mode: 'single',
      role: 'KADER',
      userId: undefined,
      title: '',
      body: '',
      type: 'GENERAL',
    },
  });

  const mode = useWatch({ control: form.control, name: 'mode' });
  const role = useWatch({ control: form.control, name: 'role' });

  const getUsersByRole = useQuery(trpc.usersPetugas.getUsersByRole.queryOptions({ role: role as 'KADER' | 'ORANGTUA' }));

  const onSubmit = async (data: FormSchema) => {
    startTransition(async () => {
      if (data.mode === 'single') {
        await sendNotification.mutate({
          userId: data.userId!,
          body: data.body,
          title: data.title,
          type: data.type,
        });
      } else {
        await sendToAll.mutate({ body: data.body, role: data.role!, title: data.title, type: 'BROADCAST' });
      }
    });

    const current = form.getValues();
    form.reset({ ...current, title: '', body: '' });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* MODE */}
        <FormField
          control={form.control}
          name="mode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mode Kirim</FormLabel>
              <FormControl>
                <Select onValueChange={(v) => field.onChange(v)} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Kirim ke Satu User</SelectItem>
                    <SelectItem value="all">Kirim ke Semua (Broadcast)</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ROLE (used for both single user list and broadcast target) */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tujuan Tipe Pengguna</FormLabel>
              <FormControl>
                <Select onValueChange={(v) => field.onChange(v)} value={field.value ?? undefined}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih " />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="KADER">Kader</SelectItem>
                    <SelectItem value="ORANGTUA">Orang Tua</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* USER SELECT (shown only when mode === 'single') */}
        {mode === 'single' && (
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pilih User</FormLabel>
                <FormControl>
                  <Select onValueChange={(v) => field.onChange(v)} value={field.value ?? undefined} disabled={isPending}>
                    <SelectTrigger>
                      <SelectValue placeholder={getUsersByRole.isLoading ? 'Memuat...' : 'Pilih user'} />
                    </SelectTrigger>
                    <SelectContent>
                      {getUsersByRole.data?.users?.length ? (
                        getUsersByRole.data.users.map((u) => (
                          <SelectItem key={u.id} value={u.id}>
                            {u.name} {u.email ? `• ${u.email}` : ''}
                          </SelectItem>
                        ))
                      ) : getUsersByRole.isLoading ? (
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
        )}

        {/* TITLE */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Judul</FormLabel>
              <FormControl>
                <Input placeholder="Judul notifikasi" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* BODY */}
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pesan</FormLabel>
              <FormControl>
                <Textarea placeholder="Tulis pesan / isi notifikasi" rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end gap-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Spinner /> <span className="ml-2">Mengirim...</span>
              </>
            ) : mode === 'single' ? (
              'Kirim ke User'
            ) : (
              'Kirim ke Semua'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
