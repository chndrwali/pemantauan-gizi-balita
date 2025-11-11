import { UserCreateModal } from './user-create-modal';
import { UsersSection } from './user-section';

export const UsersView = () => {
  return (
    <div className="flex flex-col gap-y-6 py-2.5  px-4">
      <div className="flex items-center justify-between mb-6 px-4">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Pengguna</h1>
          <p className="text-xs text-muted-foreground">Kelola pengguna dan tambah akun baru di sistem.</p>
        </div>
        <UserCreateModal />
      </div>
      <UsersSection />
    </div>
  );
};
