import { OrangTuaJanjiSection } from '@/components/features/orangtua/sections/orangtua-janji';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Orang Tua',
};

const Page = () => {
  return <OrangTuaJanjiSection />;
};

export default Page;
