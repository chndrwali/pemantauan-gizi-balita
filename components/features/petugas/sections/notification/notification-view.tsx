import { NotificationPetugasSection } from './notification-section';
import { RefreshButtonNotification } from './refresh-button-notif';

export const NotificationPetugasView = () => {
  return (
    <div className="flex flex-col gap-y-6 py-2.5  px-4">
      <div className="flex items-center justify-between px-4">
        <div>
          <h1 className="text-2xl font-bold">Notifikasi</h1>
          <p className="text-xs text-muted-foreground">Lihat notifikasi terkirim</p>
        </div>
        <RefreshButtonNotification />
      </div>
      <NotificationPetugasSection />
    </div>
  );
};
