'use client';

import { z } from 'zod';
// import Link from 'next/link';
// import { toast } from 'sonner';
import { useForm, useWatch } from 'react-hook-form';
// import { useRouter } from 'next/navigation';
import { registerSchema } from '@/lib/form-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormLabel, FormItem, FormMessage } from '@/components/ui/form';
import { Spinner } from '@/components/ui/spinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Role } from '@/lib/generated/prisma/enums';
import { useMemo, useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import bandung from '@/lib/data/bandung-kecamatan-kelurahan.json';

type RegisterFormValues = z.infer<typeof registerSchema>;
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

export function RegisterForm() {
  // const router = useRouter();

  const [passwordVisible, setPasswordVisible] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nik: '',
      email: '',
      password: '',
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

  const onSubmit = async (values: RegisterFormValues) => {
    console.log(values);
  };

  const isPending = form.formState.isSubmitting;
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Tambah Akun</h1>
            <p className="text-xs text-muted-foreground">Penambahan akun hanya dapat dilakukan melalui dashboard admin.</p>
          </div>
          <Button disabled={isPending} variant="secondary" type="submit">
            {isPending ? <Spinner /> : 'Buat Akun'}
          </Button>
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        autoComplete="new-password"
                        placeholder="Min. 8 karakter, campur huruf, angka & simbol"
                        type={passwordVisible ? 'text' : 'password'}
                        disabled={isPending}
                        value={field.value ?? ''}
                        onChange={(e) => {
                          const v = e.target.value.replace(/^\s+|\s+$/g, '');
                          field.onChange(v);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === ' ' && (e.currentTarget.selectionStart ?? 0) === 0) {
                            e.preventDefault();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setPasswordVisible((v) => !v)}
                        className="absolute inset-y-0 right-0 flex items-center px-3 focus:outline-none"
                        aria-label={passwordVisible ? 'Sembunyikan password' : 'Tampilkan password'}
                        aria-pressed={passwordVisible}
                      >
                        {passwordVisible ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                      </button>
                    </div>
                  </FormControl>
                  {/* <p className="text-xs text-muted-foreground mt-1">Minimal 8 karakter & mengandung huruf besar, huruf kecil, angka, dan simbol.</p> */}
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
