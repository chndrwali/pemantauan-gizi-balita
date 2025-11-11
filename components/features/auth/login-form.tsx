'use client';

import { z } from 'zod';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
// import { useRouter } from 'next/navigation';
import { loginSchema } from '@/lib/form-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormLabel, FormItem, FormMessage } from '@/components/ui/form';
import { useState, useTransition } from 'react';
import { login } from '@/actions/login';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  // const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    startTransition(() => {
      login(values).then((data) => {
        if (data.error) {
          toast.error('Login gagal');
        } else if (data.success) {
          toast.success(`${data.success}`);
          form.reset({
            email: '',
            password: '',
          });
        }
      });
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center flex items-center gap-2 flex-col">
          <CardTitle>
            <Link href="/" className="flex items-center">
              <Image src="/logo/logo.png" alt="Puskesmas" width={50} height={50} />
              Puskesmas Sukawarna
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-6 ">
                <div className="grid gap-6">
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
                              placeholder="Min. 8 karakter"
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
                  <Button type="submit" disabled={isPending} className="w-full">
                    {isPending ? <Spinner /> : 'Masuk'}
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Tidak punya akun?{' '}
                  <Link href="/sign-up" className="underline underline-offset-4">
                    Daftar
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
