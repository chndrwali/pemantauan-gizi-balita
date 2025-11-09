'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  const router = useRouter();

  const ADMIN_WA_NUMBER = '6281234567890';
  const DEFAULT_MESSAGE = 'Halo%20Admin%2C%20saya%20mendapat%20error%20404%20dan%20membutuhkan%20bantuan.';

  const WA_LINK = `https://wa.me/${ADMIN_WA_NUMBER}?text=${DEFAULT_MESSAGE}`;

  return (
    <div className="absolute left-1/2 top-1/2 mb-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center text-center">
      <span className="bg-linear-to-b from-foreground to-transparent bg-clip-text text-[10rem] font-extrabold leading-none text-transparent">404</span>
      <h2 className="font-heading my-2 text-2xl font-bold">Ada yang Hilang</h2>
      <p>Maaf, halaman yang anda cari tidak ada atau telah di pindahkan</p>
      <div className="mt-8 flex justify-center gap-2">
        <Button onClick={() => router.back()} variant="default" size="lg">
          Kembali
        </Button>
        <Button asChild variant="destructive" size="lg">
          <Link href={WA_LINK} target="_blank" rel="noopener noreferrer">
            Hubungi Admin
          </Link>
        </Button>
        <Button onClick={() => router.push('/')} variant="ghost" size="lg">
          Kembali ke Beranda
        </Button>
      </div>
    </div>
  );
}
