import { NotificationPetugasSection } from './notification-section';

export const NotificationPetugasView = () => {
  return (
    <div className="flex flex-col gap-y-6 py-2.5  px-4">
      <div className="flex items-center px-4">
        <div>
          <h1 className="text-2xl font-bold">Notifikasi</h1>
          <p className="text-xs text-muted-foreground">Lihat notifikasi terkirim</p>
        </div>
      </div>
      <NotificationPetugasSection />
    </div>
  );
};
