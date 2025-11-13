'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { DEFAULT_LIMIT } from '@/lib/utils';
import { useTRPC } from '@/trpc/client';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';

function fmtDate(d?: string | Date | null) {
  if (!d) return '-';
  try {
    const date = typeof d === 'string' ? new Date(d) : d;
    return `${date.toLocaleDateString('id-ID')} ${date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
  } catch {
    return String(d);
  }
}

function excerpt(text = '', len = 120) {
  if (text.length <= len) return text;
  return text.slice(0, len).trimEnd() + '…';
}

export const NotificationPetugasSection = () => {
  const trpc = useTRPC();
  const [page, setPage] = useState<number>(1);

  const data = useSuspenseQuery(trpc.usersPetugas.getNotificationMany.queryOptions({ page, limit: DEFAULT_LIMIT }));

  const items = data.data.items;
  const pageCount = data.data.pageCount;
  //   const total = data.data.total;

  return (
    <Card className="p-0">
      <div className="divide-y">
        {data.isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Spinner />
          </div>
        ) : items.length === 0 ? (
          <div className="p-6 text-center text-sm text-slate-500">Belum ada notifikasi.</div>
        ) : (
          items.map((n) => (
            <div key={n.id} className="p-4 sm:p-5 flex gap-4 items-start">
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <Badge className="text-xs py-0.5 px-2" variant="secondary">
                      {n.type ?? 'GENERAL'}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium text-slate-900 truncate">Judul : {n.title}</h4>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">Isi Pesan : {excerpt(n.body ?? '-', 140)}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs text-slate-500">Untuk</div>
                    <UserInfo id={n.userId} />
                    <div className="text-xs text-slate-400 mt-2">Terkirim {fmtDate(n.createdAt)}</div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        <div className="px-4 py-3 border-t bg-muted/5 flex items-center justify-between gap-3">
          <div className="text-sm text-slate-600">
            Halaman {page} dari {pageCount}
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" disabled={page <= 1 || data.isFetching} onClick={() => setPage(1)}>
              First
            </Button>
            <Button size="sm" variant="outline" disabled={page <= 1 || data.isFetching} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              Prev
            </Button>

            <div className="px-3 text-sm text-slate-700">{data.isFetching ? 'Memuat…' : `Go to page`}</div>

            <Button size="sm" variant="outline" disabled={page >= pageCount || data.isFetching} onClick={() => setPage((p) => Math.min(pageCount, p + 1))}>
              Next
            </Button>
            <Button size="sm" variant="outline" disabled={page >= pageCount || data.isFetching} onClick={() => setPage(pageCount)}>
              Last
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

interface UserProps {
  id: string;
}

const UserInfo = ({ id }: UserProps) => {
  const trpc = useTRPC();

  const data = useQuery(trpc.usersPetugas.getByID.queryOptions({ id }));
  const user = data.data?.user;

  return (
    <div>
      <div className="text-sm font-medium text-slate-700">{user?.name ?? '-'}</div>
      <Badge variant="outline">PERAN : {user?.role}</Badge>
    </div>
  );
};
