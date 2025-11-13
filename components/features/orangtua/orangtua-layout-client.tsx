'use client';
import dynamic from 'next/dynamic';

const OrangTuaLayout = dynamic(() => import('./orangtua-layout'), { ssr: false });
export default function OrangTuaLayoutClient({ children }: { children: React.ReactNode }) {
  return <OrangTuaLayout>{children}</OrangTuaLayout>;
}
