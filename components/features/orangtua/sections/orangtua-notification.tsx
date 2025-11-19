'use client';

import { DEFAULT_LIMIT } from '@/lib/utils';
import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, BellRing, Calendar, Clock, CheckCircle2 } from 'lucide-react';

interface Props {
  id: string;
}

export const OrangTuaNotification = ({ id }: Props) => {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.usersPetugas.getNotificationByUserId.queryOptions({
      id,
      limit: DEFAULT_LIMIT,
    })
  );
  const notif = data.data;

  // Helper function untuk mendapatkan icon berdasarkan type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'REMINDER':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'ANNOUNCEMENT':
        return <BellRing className="h-5 w-5 text-green-600" />;
      case 'ALERT':
        return <Bell className="h-5 w-5 text-red-600" />;
      case 'INFO':
        return <CheckCircle2 className="h-5 w-5 text-blue-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  // Helper function untuk mendapatkan badge color berdasarkan type
  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'REMINDER':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ANNOUNCEMENT':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'ALERT':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'INFO':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Helper function untuk mendapatkan badge color berdasarkan status
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'READ':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'UNREAD':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'SENT':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'SCHEDULED':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Helper function untuk format tanggal
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Helper function untuk format waktu relatif
  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - new Date(date).getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      return 'Baru saja';
    } else if (diffInHours < 24) {
      return `${diffInHours} jam yang lalu`;
    } else if (diffInDays === 1) {
      return 'Kemarin';
    } else if (diffInDays < 7) {
      return `${diffInDays} hari yang lalu`;
    } else {
      return formatDate(date);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-3">
            <BellRing className="h-8 w-8 text-blue-600" />
            Notifikasi
          </h1>
          <p className="text-slate-600 mt-2">Lihat semua pemberitahuan dan pengumuman penting</p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center bg-blue-50 border-blue-200">
          <div className="text-2xl font-bold text-blue-900">{notif.length}</div>
          <div className="text-sm text-blue-700">Total Notifikasi</div>
        </Card>
        <Card className="p-4 text-center bg-orange-50 border-orange-200">
          <div className="text-2xl font-bold text-orange-900">{notif.filter((n) => n.status === 'UNREAD').length}</div>
          <div className="text-sm text-orange-700">Belum Dibaca</div>
        </Card>
        <Card className="p-4 text-center bg-green-50 border-green-200">
          <div className="text-2xl font-bold text-green-900">{notif.filter((n) => n.status === 'READ').length}</div>
          <div className="text-sm text-green-700">Sudah Dibaca</div>
        </Card>
        <Card className="p-4 text-center bg-yellow-50 border-yellow-200">
          <div className="text-2xl font-bold text-yellow-900">{notif.filter((n) => n.type === 'ALERT').length}</div>
          <div className="text-sm text-yellow-700">Peringatan</div>
        </Card>
      </div>

      {/* Notifications List */}
      <Card className="p-6 shadow-sm">
        {notif.length > 0 ? (
          <div className="space-y-4">
            {notif.map((notification) => (
              <div
                key={notification.id}
                className={`
                                    border rounded-lg p-4 transition-all duration-200
                                    ${notification.status === 'UNREAD' ? 'border-blue-300 bg-blue-50 shadow-sm' : 'border-slate-200 bg-white'}
                                    hover:border-blue-400 hover:shadow-md
                                `}
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  {/* Icon */}
                  <div className="shrink-0">
                    <div
                      className={`
                                            p-3 rounded-full
                                            ${notification.status === 'UNREAD' ? 'bg-blue-100' : 'bg-slate-100'}
                                        `}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                      <h3
                        className={`
                                                text-lg font-semibold
                                                ${notification.status === 'UNREAD' ? 'text-blue-900' : 'text-slate-900'}
                                            `}
                      >
                        {notification.title}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge className={getTypeBadgeColor(notification.type)}>
                          {notification.type === 'REMINDER' && 'Pengingat'}
                          {notification.type === 'ANNOUNCEMENT' && 'Pengumuman'}
                          {notification.type === 'ALERT' && 'Peringatan'}
                          {notification.type === 'INFO' && 'Informasi'}
                        </Badge>
                        <Badge className={getStatusBadgeColor(notification.status)}>
                          {notification.status === 'READ' && 'Sudah Dibaca'}
                          {notification.status === 'UNREAD' && 'Belum Dibaca'}
                          {notification.status === 'SENT' && 'Terkirim'}
                          {notification.status === 'SCHEDULED' && 'Terjadwal'}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-slate-700 mb-4 leading-relaxed">{notification.body}</p>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm text-slate-500">
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(notification.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{getRelativeTime(notification.createdAt)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* {notification.status === 'UNREAD' && (
                          <Button size="sm" variant="outline" className="h-8 text-xs">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Tandai Dibaca
                          </Button>
                        )} */}
                        {/* <Button size="sm" variant="outline" className="h-8 text-xs">
                          <Eye className="h-3 w-3 mr-1" />
                          Lihat Detail
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 text-xs text-red-600 border-red-200 hover:bg-red-50">
                          <Trash2 className="h-3 w-3 mr-1" />
                          Hapus
                        </Button> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg">
            <Bell className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Tidak ada notifikasi</h3>
            <p className="text-slate-600 max-w-md mx-auto">Anda belum memiliki notifikasi. Notifikasi baru akan muncul di sini</p>
          </div>
        )}
      </Card>

      {/* Informasi Penting */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <BellRing className="h-5 w-5" />
          Informasi Notifikasi
        </h3>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>
            • <strong>Pengingat</strong>: Jadwal posyandu, imunisasi, dan aktivitas penting
          </li>
          <li>
            • <strong>Pengumuman</strong>: Informasi umum dari petugas kesehatan
          </li>
          <li>
            • <strong>Peringatan</strong>: Status gizi yang perlu perhatian khusus
          </li>
          <li>
            • <strong>Informasi</strong>: Tips kesehatan dan perkembangan anak
          </li>
          <li>• Pastikan untuk membaca notifikasi yang belum dibaca untuk informasi terbaru</li>
        </ul>
      </Card>
    </div>
  );
};
