import { OrangTuaNavbar } from './orangtua-navbar';

interface OrangTuaLayoutProps {
  children: React.ReactNode;
}

const OrangTuaLayout = ({ children }: OrangTuaLayoutProps) => {
  return (
    <div className="w-full">
      <OrangTuaNavbar />
      <div className="flex min-h-screen pt-6">
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default OrangTuaLayout;
