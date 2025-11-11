import type { Metadata } from 'next';
import './globals.css';
import { TRPCReactProvider } from '@/trpc/client';
import { Toaster } from '@/components/ui/sonner';
import { Inter } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/lib/auth';

const inter = Inter({ subsets: ['latin'], weight: ['400', '700'] });

export const metadata: Metadata = {
  title: {
    default: 'Pemantauan Gizi Balita | Puskesmas Sukawarna',
    template: '%s - Pemantauan Gizi Balita | Puskesmas Sukawarna',
  },
  description:
    'Sistem Pemantauan Gizi Balita di Puskesmas Sukawarna. Memudahkan orang tua memantau perkembangan status gizi balita secara berkala, mulai dari pencatatan berat badan, tinggi badan, hingga grafik pertumbuhan sesuai standar Kemenkes.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <SessionProvider session={session}>
          <TRPCReactProvider>{children}</TRPCReactProvider>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
