'use client';
import dynamic from 'next/dynamic';

const KaderLayout = dynamic(() => import('./kader-layout'), { ssr: false });
export default function KaderLayoutClient({ children }: { children: React.ReactNode }) {
  return <KaderLayout>{children}</KaderLayout>;
}
