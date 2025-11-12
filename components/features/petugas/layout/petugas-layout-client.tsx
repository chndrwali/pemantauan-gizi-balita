'use client';
import dynamic from 'next/dynamic';

const PetugasLayout = dynamic(() => import('./petugas-layout'), { ssr: false });
export default function PetugasLayoutClient({ children }: { children: React.ReactNode }) {
  return <PetugasLayout>{children}</PetugasLayout>;
}
