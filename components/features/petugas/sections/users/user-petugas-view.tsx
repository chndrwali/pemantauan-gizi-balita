import { UsersPetugasSection } from './user-petugas-section';

export const UsersPetugasView = () => {
  return (
    <div className="flex flex-col gap-y-6 py-2.5  px-4">
      <div className="flex items-center px-4">
        <div>
          <h1 className="text-2xl font-bold">Data Pengguna</h1>
          <p className="text-xs text-muted-foreground">Lihat data pengguna. Petugas tidak dapat menambah atau mengubah akun.</p>
        </div>
      </div>
      <UsersPetugasSection />
    </div>
  );
};
