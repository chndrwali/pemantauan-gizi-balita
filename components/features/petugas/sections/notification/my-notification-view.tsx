import { MyNotificationSection } from './my-notification-section';

interface Props {
  id: string;
}

export const MyNotificationView = ({ id }: Props) => {
  return (
    <div className="flex flex-col gap-y-6 py-2.5  px-4">
      <div className="flex items-center justify-between px-4">
        <div>
          <h1 className="text-2xl font-bold">Notifikasi Saya</h1>
          <p className="text-xs text-muted-foreground">Lihat notifikasi diterima</p>
        </div>
      </div>
      <MyNotificationSection id={id} />
    </div>
  );
};
