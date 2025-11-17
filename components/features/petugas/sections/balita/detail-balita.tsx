'use client';

import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Copy, MapPin, User, Phone } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  id: string;
}

function fmtDate(iso?: string | null) {
  if (!iso) return '-';
  try {
    return format(new Date(iso), 'd MMMM yyyy', { locale: localeId });
  } catch {
    return iso;
  }
}

function fmtNum(v?: number | null, suffix = '') {
  if (v === null || v === undefined) return '-';
  return `${v}${suffix}`;
}

export const DetailBalita = ({ id }: Props) => {
  const trpc = useTRPC();

  const { data, isLoading, isError } = useQuery(trpc.balita.getById.queryOptions({ id }));
  const item = data;
  const orangTua = data?.orangTua;
  const pengukuran = data?.pengukuranTerbaru;
  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardContent className="py-8 text-center text-sm text-muted-foreground">Memuat data...</CardContent>
      </Card>
    );
  }

  if (isError || !item) {
    return (
      <Card className="shadow-sm">
        <CardContent className="py-8 text-center text-sm text-muted-foreground">Data tidak ditemukan</CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src={`https://api.dicebear.com/6.x/bottts/svg?seed=${encodeURIComponent(item.nama)}`} />
          <AvatarFallback>{item.nama?.slice(0, 1) ?? 'B'}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <CardTitle className="text-lg leading-tight">{item.nama}</CardTitle>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={item.aktif ? 'secondary' : 'destructive'}>{item.aktif ? 'Aktif' : 'Nonaktif'}</Badge>
            <span className="text-sm text-muted-foreground">{item.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
            {item.anakKe != null && <span className="text-sm text-muted-foreground">• Anak ke-{item.anakKe}</span>}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="text-xs text-muted-foreground">Lahir: {fmtDate(item.tanggalLahir)}</div>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    navigator.clipboard?.writeText(item.id);
                    toast.success('ID disalin ke clipboard!');
                  }}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Salin ID</TooltipContent>
            </Tooltip>

            <Button size="sm" variant="ghost" onClick={() => {}}>
              Cetak
            </Button>
            <Button size="sm" onClick={() => {}}>
              Edit
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Identitas & alamat */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Identitas</div>
            <div className="text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 mt-1" />
                <div>
                  <div className="font-medium">{item.nama}</div>
                  <div className="text-xs">NIK: {item.nikAnak ?? '-'}</div>
                  <div className="text-xs">No KIA: {item.noKIA ?? '-'}</div>
                </div>
              </div>

              <div className="flex items-start gap-3 mt-3">
                <MapPin className="w-4 h-4 mt-1" />
                <div className="text-sm">
                  {item.alamat ?? '-'}
                  <div className="text-xs text-muted-foreground">
                    {item.kelurahan ?? '-'}, {item.kecamatan ?? '-'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pengukuran terbaru */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Pengukuran Terbaru</div>
            <div className="p-3 rounded-md bg-muted/30">
              {pengukuran ? (
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">Tanggal: {fmtDate(pengukuran.tanggal)}</div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-xs text-muted-foreground">Berat (kg)</div>
                      <div className="text-lg font-semibold">{fmtNum(pengukuran.beratKg)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Tinggi (cm)</div>
                      <div className="text-lg font-semibold">{fmtNum(pengukuran.tinggiCm)}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-1 text-xs text-muted-foreground">
                    <div>BB/TB: {pengukuran.statusBBTB ?? '-'}</div>
                    <div>BB/U: {pengukuran.statusBBU ?? '-'}</div>
                    <div>TBU: {pengukuran.statusTBU ?? '-'}</div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">Belum ada pengukuran</div>
              )}
            </div>
          </div>

          {/* Orang tua & metadata */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Orang Tua & Metadata</div>
            <div className="text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 mt-1" />
                <div>
                  <div className="font-medium">{orangTua?.name ?? '-'}</div>
                  <div className="text-xs">ID: {orangTua?.id ?? '-'}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <Phone className="w-4 h-4" />
                <div className="text-sm">{orangTua?.phone ?? '-'}</div>
              </div>

              <Separator className="my-3" />

              <div className="text-xs grid grid-cols-1 gap-1">
                <div>
                  <span className="font-medium">BB Lahir:</span> {fmtNum(item.bbLahirKg, ' kg')}
                </div>
                <div>
                  <span className="font-medium">TB Lahir:</span> {fmtNum(item.tbLahirCm, ' cm')}
                </div>
                <div>
                  <span className="font-medium">Jenis Kelamin:</span> {item.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
