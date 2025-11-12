'use client';

import { z } from 'zod';
import { toast } from 'sonner';
import { useForm, useWatch } from 'react-hook-form';
import { updateUserSchema } from '@/lib/form-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormLabel, FormItem, FormMessage } from '@/components/ui/form';
import { Spinner } from '@/components/ui/spinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Role } from '@/lib/generated/prisma/enums';
import { useEffect, useMemo, useState, useTransition } from 'react';
import { Textarea } from '@/components/ui/textarea';
import bandung from '@/lib/data/bandung-kecamatan-kelurahan.json';
import { FormSuccess } from '@/components/features/auth/form-success';
import { FormError } from '@/components/features/auth/form-error';
import { useTRPC } from '@/trpc/client';
import { useMutation, useQuery } from '@tanstack/react-query';

interface Props {
  userId: string;
  onSuccess: () => void;
}

type UpdateUserFormValues = z.infer<typeof updateUserSchema>;
const labelize = (val: string) => {
  if (val === 'ORANGTUA') return 'Orang Tua/Wali';

  return val
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/(^|\s)\S/g, (s) => s.toUpperCase());
};

const ROLE_OPTIONS = Object.values(Role).filter((r) => r !== 'PUSKESMAS') as Array<keyof typeof Role>;

const ALL_KECAMATAN = Object.keys(bandung);
const RT_RW = Array.from({ length: 32 }, (_, i) => String(i + 1));

export function UpdateUserForm({ userId, onSuccess }: Props) {
  const trpc = useTRPC();
  const { data, isLoading, refetch } = useQuery(trpc.usersAdmin.getByID.queryOptions({ id: userId! }, { enabled: !!userId }));
  const user = data?.user;

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isPending, startTransition] = useTransition();

  const form = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      nik: '',
      email: '',
      address: '',
      kecamatan: '',
      kelurahan: '',
      kodeWilayah: '',
      name: '',
      nomorSIP: '',
      phone: '',
      role: 'ORANGTUA',
      rt: '',
      rw: '',
      username: '',
    },
  });

  useEffect(() => {
    if (!user) return;

    const clean = (v?: string | null): string => (typeof v === 'string' ? v.trim() : '');
    const normalizeRtRw = (v?: string | null): string | undefined => {
      if (!v) return undefined;
      const digits = v.replace(/\D/g, '');
      if (!digits) return undefined;
      const n = Number(digits);
      if (!n || n < 1 || n > 32) return undefined;
      return String(n);
    };

    const bandungMap = bandung as Record<string, string[]>;
    const rawKec = clean(user.kecamatan);
    const kecamatanKey = rawKec ? ALL_KECAMATAN.find((k) => k.toLowerCase() === rawKec.toLowerCase()) : undefined;

    const rawKel = clean(user.kelurahan);
    let kelurahanValue: string | undefined = undefined;
    if (kecamatanKey && rawKel && bandungMap[kecamatanKey]) {
      const foundKel = bandungMap[kecamatanKey].find((kl) => kl.toLowerCase() === rawKel.toLowerCase());
      kelurahanValue = foundKel ?? rawKel;
    } else if (rawKel) {
      kelurahanValue = rawKel;
    }

    // debug log (hapus kalau udah oke)

    console.log('DBG user:', { rawKec, kecamatanKey, rawKel, kelurahanValue, rt: user.rt, rw: user.rw });

    form.reset({
      nik: user.nik ?? '',
      name: user.name ?? '',
      username: user.username ?? '',
      phone: user.phone ?? '',
      address: user.address ?? '',
      rt: normalizeRtRw(user.rt),
      rw: normalizeRtRw(user.rw),
      kecamatan: kecamatanKey ?? rawKec ?? undefined, // set found key, else raw value, else undefined
      kelurahan: kelurahanValue ?? undefined,
      kodeWilayah: user.kodeWilayah ?? '',
      nomorSIP: user.nomorSIP ?? '',
      email: user.email ?? '',
      role: user.role as 'KADER' | 'PETUGAS' | 'ORANGTUA',
    });

    void form.trigger(['rt', 'rw', 'kecamatan', 'kelurahan']);
  }, [user, form]);

  const updateMutation = useMutation(
    trpc.usersAdmin.updateUser.mutationOptions({
      onSuccess: () => {
        // success handler
        toast.success('User berhasil diperbarui');
        setSuccess('User berhasil diperbarui');
        setError('');
        onSuccess(); // close modal parent
        refetch(); // refresh user data
      },
      onError: (err) => {
        const msg = err?.message ?? 'Gagal memperbarui user';
        toast.error(msg);
        setError(msg);
      },
    })
  );

  const onSubmit = async (values: UpdateUserFormValues) => {
    if (!userId) {
      setError('User ID tidak tersedia');
      return;
    }

    setError('');
    setSuccess('');

    startTransition(() => {
      const payload: {
        id: string;
        nik?: string;
        name?: string;
        username?: string;
        phone?: string;
        address?: string;
        rt?: string;
        rw?: string;
        kelurahan?: string;
        kecamatan?: string;
        kodeWilayah?: string;
        nomorSIP?: string;
        email?: string;
        password?: string;
        role?: 'KADER' | 'PETUGAS' | 'ORANGTUA';
      } = { id: userId };

      if (values.nik?.trim()) payload.nik = values.nik.trim();
      if (values.name?.trim()) payload.name = values.name.trim();
      if (values.username?.trim()) payload.username = values.username.trim();
      if (values.phone?.trim()) payload.phone = values.phone.trim();
      if (values.address?.trim()) payload.address = values.address.trim();
      if (values.rt?.trim()) payload.rt = values.rt.trim();
      if (values.rw?.trim()) payload.rw = values.rw.trim();
      if (values.kelurahan?.trim()) payload.kelurahan = values.kelurahan.trim();
      if (values.kecamatan?.trim()) payload.kecamatan = values.kecamatan.trim();
      if (values.kodeWilayah?.trim()) payload.kodeWilayah = values.kodeWilayah.trim();
      if (values.nomorSIP?.trim()) payload.nomorSIP = values.nomorSIP.trim();
      if (values.email?.trim()) payload.email = values.email.trim();
      if (values.role) payload.role = values.role as 'KADER' | 'PETUGAS' | 'ORANGTUA';

      updateMutation.mutate(payload);
    });
  };

  const role = useWatch({
    control: form.control,
    name: 'role',
    defaultValue: form.getValues('role'), // jaga default
  });
  const isStaff = role === 'KADER' || role === 'PETUGAS';

  const kecamatan = useWatch({ control: form.control, name: 'kecamatan' });
  const kelurahanOptions = useMemo(() => {
    if (!kecamatan || !(kecamatan in bandung)) return [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (bandung as any)[kecamatan] as string[];
  }, [kecamatan]);

  if (!userId) {
    return <p className="p-4 text-sm text-muted-foreground">Tidak ada user yang dipilih.</p>;
  }
  if (isLoading && !user) {
    return (
      <div className="p-4 flex items-center place-content-center justify-center">
        <Spinner />
      </div>
    );
  }
  if (!user) {
    return <p className="p-4 text-sm text-destructive">Pengguna tidak ditemukan.</p>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-muted-foreground">Perubahan akun hanya dapat dilakukan melalui dashboard admin.</p>
          </div>
          <div className="flex flex-col gap-y-2">
            <Button disabled={isPending} variant="secondary" type="submit">
              {isPending ? <Spinner /> : 'Update'}
            </Button>
            <FormSuccess message={success} />
            <FormError message={error} />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 ">
          <div className="space-y-4 lg:col-span-3 ">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="flex items-center gap-x-2">
                  <FormLabel>Tipe Pengguna</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value ?? undefined} disabled={isPending}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih role akun" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ROLE_OPTIONS.map((value) => (
                        <SelectItem key={value} value={value}>
                          {labelize(value)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nik"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <div className="flex items-center gap-x-2 ">Nomor Induk Kependudukan (NIK)</div>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      autoComplete="off"
                      placeholder="Contoh: 3578123456780002"
                      min={0}
                      value={field.value ?? ''}
                      onChange={(e) => {
                        // hanya angka & limit 16
                        const v = e.target.value.replace(/\D/g, '').slice(0, 16);
                        field.onChange(v);
                      }}
                      maxLength={16}
                      onKeyDown={(e) => {
                        if (['e', 'E', '+', '-', '.', ','].includes(e.key)) e.preventDefault();
                        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') e.preventDefault();
                      }}
                      onWheel={(e) => e.currentTarget.blur()}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <div className="flex items-center gap-x-2 ">Nama Lengkap</div>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Contoh : Thom Haye"
                      type="text"
                      disabled={isPending}
                      autoComplete="off"
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^A-Za-zÀ-ÿ\s-]/g, '');
                        field.onChange(value);
                      }}
                      onKeyDown={(e) => {
                        // cegah angka & simbol yang sering lolos via keyboard event
                        if (/[0-9]/.test(e.key) || ['!', '@', '#', '$', '%', '^', '&', '*', '_', '+', '=', '/', '\\', '.', ',', '"', "'", '(', ')', '[', ']', '{', '}'].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat Lengkap</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Contoh: Jl. Ir. H. Djuanda No. 123, Kota Bandung, Jawa Barat" rows={3} className="resize-y" onChange={(e) => field.onChange(e.target.value.trimStart())} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {/* RT */}
              <div className="md:col-span-1">
                <FormField
                  control={form.control}
                  name="rt"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-x-2">
                      <FormLabel>RT</FormLabel>
                      <Select onValueChange={(v) => field.onChange(v)} defaultValue={field.value ?? undefined}>
                        <FormControl>
                          <SelectTrigger className="h-9 text-sm">
                            <SelectValue placeholder="Pilih" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="text-sm">
                          {RT_RW.map((v) => (
                            <SelectItem key={v} value={v}>
                              {v.padStart(2, '0')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* RW */}
              <div className="md:col-span-1">
                <FormField
                  control={form.control}
                  name="rw"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-x-2">
                      <FormLabel>RW</FormLabel>
                      <Select onValueChange={(v) => field.onChange(v)} defaultValue={field.value ?? undefined}>
                        <FormControl>
                          <SelectTrigger className="h-9 text-sm">
                            <SelectValue placeholder="Pilih" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="text-sm">
                          {RT_RW.map((v) => (
                            <SelectItem key={v} value={v}>
                              {v.padStart(2, '0')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* KECAMATAN */}
              <div className="md:col-span-3">
                <FormField
                  control={form.control}
                  name="kecamatan"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-x-2">
                      <FormLabel>Kecamatan</FormLabel>
                      <Select
                        onValueChange={(v) => {
                          // reset kelurahan kalau ganti kecamatan
                          form.setValue('kelurahan', '');
                          field.onChange(v);
                        }}
                        defaultValue={field.value ?? undefined}
                      >
                        <FormControl>
                          <SelectTrigger className="h-9 text-sm">
                            <SelectValue placeholder="Pilih kecamatan" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="text-sm">
                          {ALL_KECAMATAN.map((k) => (
                            <SelectItem key={k} value={k}>
                              {k}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <FormField
              control={form.control}
              name="kelurahan"
              render={({ field }) => (
                <FormItem className="flex items-center gap-x-2">
                  <FormLabel>Kelurahan</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value ?? undefined} disabled={!kecamatan}>
                    <FormControl>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder={kecamatan ? 'Pilih kelurahan' : 'Pilih kecamatan dulu'} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="text-sm">
                      {kelurahanOptions.map((kel) => (
                        <SelectItem key={kel} value={kel}>
                          {kel}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* kolom ke 2 */}
          <div className="flex flex-col space-y-4 lg:col-span-2">
            {isStaff && (
              <>
                <FormField
                  control={form.control}
                  name="kodeWilayah"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kode Wilayah</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Contoh: 3578.01.02" onChange={(e) => field.onChange(e.target.value.trimStart())} disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nomorSIP"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor SIP</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Contoh: SIP-123/PKM/2025" onChange={(e) => field.onChange(e.target.value.trimStart())} disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <div className="flex items-center gap-x-2 ">Username</div>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Contoh : ThomHaye12" type="text" disabled={isPending} autoComplete="off" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <div className="flex items-center gap-x-2 ">Nomor Handphone/Whatsapp Aktif</div>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      autoComplete="off"
                      placeholder="Contoh: 08954567212"
                      min={0}
                      value={field.value ?? ''}
                      onChange={(e) => {
                        // hanya angka & limit 16
                        const v = e.target.value.replace(/\D/g, '').slice(0, 13);
                        field.onChange(v);
                      }}
                      maxLength={13}
                      onKeyDown={(e) => {
                        if (['e', 'E', '+', '-', '.', ','].includes(e.key)) e.preventDefault();
                        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') e.preventDefault();
                      }}
                      onWheel={(e) => e.currentTarget.blur()}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <div className="flex items-center gap-x-2 ">Email Aktif</div>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="thom@example.com"
                      type="email"
                      onKeyDown={(e) => {
                        if (e.key === ' ') e.preventDefault();
                      }}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  );
}
