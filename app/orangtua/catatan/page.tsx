import { OrangTuaCatatanSection } from '@/components/features/orangtua/sections/orangtua-catatan';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Orang Tua',
};

const Page = () => {
  return <OrangTuaCatatanSection />;
};

export default Page;
