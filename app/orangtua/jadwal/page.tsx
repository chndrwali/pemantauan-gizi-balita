import { OrangTuaJadwalSection } from '@/components/features/orangtua/sections/orangtua-jadwal';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Orang Tua',
};

const Page = () => {
  return <OrangTuaJadwalSection />;
};

export default Page;
