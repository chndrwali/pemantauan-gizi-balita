'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { RegisterForm } from '@/components/features/auth/register-form';

const ADMIN_WA_NUMBER = '6281234567890';
const WA_MESSAGE = 'Halo%20Admin%2C%20saya%20ingin%20mendaftar%20akun%20aplikasi.';
const WA_LINK = `https://wa.me/${ADMIN_WA_NUMBER}?text=${WA_MESSAGE}`;

const PUSKESMAS_ADDRESS = 'Puskesmas%20Cempaka%20Putih%20Jakarta';
const MAPS_LINK = `https://www.google.com/maps/dir/?api=1&destination=${PUSKESMAS_ADDRESS}`;

export default function RestrictedSignup() {
  const router = useRouter();

  return (
    <div className="absolute left-1/2 top-1/2 mb-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center text-center max-w-lg mx-auto p-4">
      <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl">Pendaftaran Akun</h1>

      <p className="mt-4 text-lg text-muted-foreground">Maaf, untuk mendaftarkan akun Anda saat ini, silakan **hubungi admin** atau **datang langsung** ke Puskesmas terdekat.</p>

      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
        <Button asChild variant="default" size="lg" className="w-full sm:w-auto">
          <Link href={WA_LINK} target="_blank" rel="noopener noreferrer">
            Hubungi Admin (WhatsApp)
          </Link>
        </Button>

        <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
          <Link href={MAPS_LINK} target="_blank" rel="noopener noreferrer">
            Rute ke Puskesmas
          </Link>
        </Button>

        <Button onClick={() => router.back()} variant="outline" size="lg" className="w-full sm:w-auto">
          Kembali
        </Button>
      </div>
      <div>
        <RegisterForm />
      </div>
    </div>
  );
}
