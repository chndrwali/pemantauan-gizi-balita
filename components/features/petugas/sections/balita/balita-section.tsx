'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DEFAULT_LIMIT } from '@/lib/utils';
import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { EyeIcon, Filter, Search, X } from 'lucide-react';
import { Suspense, useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { DetailBalitaModal } from './detail-balita-modal';

function fmtDateShort(d?: string | Date | null) {
  if (!d) return '-';
  try {
    const date = typeof d === 'string' ? new Date(d) : d;
    return format(date, 'd MMM yyyy');
  } catch {
    return String(d);
  }
}

export const BalitaSection = () => {
  return (
    <Suspense fallback={<BalitaSectionSkeleton />}>
      <ErrorBoundary fallback={<p className="p-6 text-sm text-destructive">Terjadi Kesalahan...</p>}>
        <BalitaSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const BalitaSectionSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 py-6">
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead className="min-w-[220px]">Identitas</TableHead>
              <TableHead className="min-w-40">Kontak</TableHead>
              <TableHead className="min-w-[120px]">Tipe Pengguna</TableHead>
              <TableHead className="min-w-40">Alamat</TableHead>
              <TableHead className="min-w-[140px]">Wilayah</TableHead>
              <TableHead className="min-w-[140px]">SIP</TableHead>
              <TableHead className="min-w-[140px]">Dibuat</TableHead>
              <TableHead className="min-w-[140px]">Diubah</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-4" />
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[180px]" />
                    <Skeleton className="h-3 w-[120px]" />
                    <Skeleton className="h-3 w-[120px]" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-[140px]" />
                    <Skeleton className="h-3 w-[100px]" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-3 w-40" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-3 w-[120px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-3 w-[120px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-3 w-[100px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-3 w-[100px]" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const BalitaSectionSuspense = () => {
  const trpc = useTRPC();

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedIdForUpdate, setSelectedIdForUpdate] = useState<string>('');

  const { data } = useSuspenseQuery(
    trpc.balita.getManyBalita.queryOptions({
      limit: DEFAULT_LIMIT,
      search: debouncedSearch || undefined,
    })
  );

  const allBalita = data.items || [];
  const pageCount = 1;

  const toggleSelectAll = () => {
    const selectableUsers = allBalita.filter((balita) => balita.aktif === true);
    if (selectedItems.length === selectableUsers.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(allBalita.map((balita) => balita.id));
    }
  };

  const toggleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setSelectedItems([]); // Clear selections when changing page
  };

  // Generate pagination items
  const getPaginationItems = () => {
    const items = [];

    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink isActive={page === 1} onClick={() => handlePageChange(1)}>
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Show ellipsis if needed
    if (page > 3) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Show current page and neighbors
    for (let i = Math.max(2, page - 1); i <= Math.min(pageCount - 1, page + 1); i++) {
      if (i === 1 || i === pageCount) continue; // Skip first and last as they're always shown
      items.push(
        <PaginationItem key={i}>
          <PaginationLink isActive={page === i} onClick={() => handlePageChange(i)}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Show ellipsis if needed
    if (page < pageCount - 2) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always show last page if there's more than one page
    if (pageCount > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink isActive={page === pageCount} onClick={() => handlePageChange(pageCount)}>
            {pageCount}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="flex flex-col gap-6 py-6">
      <DetailBalitaModal id={selectedIdForUpdate} open={isDetailOpen} onOpenChange={setIsDetailOpen} />

      <div className="px-6">
        {/* Filters */}
        <div className="mb-3 grid gap-3 sm:grid-cols-3">
          <div className="flex flex-col gap-1">
            <Label htmlFor="search">Cari (nama / NIK / No KIA)</Label>
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground" />
              </span>
              <Input id="search" placeholder="Ketik untuk mencari..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 pr-8" />
              {search && (
                <button type="button" aria-label="Clear search" className="absolute right-2 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100" onClick={() => setSearch('')}>
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-end gap-2">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => {
                setSearch('');
                setPage(1);
              }}
            >
              <Filter className="mr-2 h-4 w-4" />
              Reset Filter
            </Button>
          </div>
        </div>

        <div className="rounded-md border shadow-sm">
          <div className="overflow-x-auto">
            <Table className="min-w-[1100px]">
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="w-12sticky left-0 bg-muted/40 backdrop-blur supports-backdrop-filter:bg-muted/60 z-10">
                    <Checkbox checked={allBalita.length > 0 && selectedItems.length === allBalita.length} onCheckedChange={toggleSelectAll} aria-label="Select all items" />
                  </TableHead>
                  <TableHead className="min-w-60">Identitas Balita</TableHead>
                  <TableHead className="min-w-[220px]">Orang Tua & Kontak</TableHead>
                  <TableHead className="min-w-[120px]">Status</TableHead>
                  {/* <TableHead className="min-w-40">Pengukuran Terakhir</TableHead> */}
                </TableRow>
              </TableHeader>

              <TableBody>
                {allBalita.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      Tidak ada balita ditemukan
                    </TableCell>
                  </TableRow>
                ) : (
                  allBalita.map((b) => {
                    // const pengukuran = Array.isArray(b.pengukuran) && b.pengukuran.length > 0 ? b.pengukuran[0] : undefined;
                    const orangTua = b.orangTua ?? undefined;

                    return (
                      <TableRow key={b.id}>
                        <TableCell className="sticky left-0 bg-background z-10">
                          <Checkbox checked={selectedItems.includes(b.id)} onCheckedChange={() => toggleSelectItem(b.id)} aria-label={`Select ${b.nama}`} />
                        </TableCell>

                        {/* Identitas */}
                        <TableCell>
                          <div className="flex flex-col gap-1 max-w-60">
                            <div className="font-medium leading-tight truncate" title={b.nama ?? ''}>
                              Nama : {b.nama ?? '-'}
                            </div>
                            <div className="text-xs text-muted-foreground truncate" title={b.jenisKelamin ?? ''}>
                              Kelamin: {b.jenisKelamin === 'L' ? 'Laki-Laki' : 'Perempuan'}
                            </div>
                            <div className="text-xs text-muted-foreground truncate" title={b.nikAnak ?? ''}>
                              NIK: {b.nikAnak ?? '-'}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">Lahir: {b.tanggalLahir ? fmtDateShort(b.tanggalLahir) : '-'}</div>

                            <div className="text-xs text-muted-foreground truncate" title={b.noKIA ?? ''}>
                              No KIA: {b.noKIA ?? '-'}
                            </div>
                          </div>
                        </TableCell>

                        {/* Kontak & KIA */}
                        <TableCell>
                          <div className="flex flex-col gap-1 max-w-[220px]">
                            <div className="text-xs text-muted-foreground truncate" title={orangTua?.phone ?? ''}>
                              Orang Tua: {orangTua?.name ?? '-'}
                            </div>
                            <div className="text-xs text-muted-foreground truncate" title={orangTua?.phone ?? ''}>
                              HP: {orangTua?.phone ?? '-'}
                            </div>
                          </div>
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          <Badge variant="secondary" className="uppercase">
                            {b.aktif ? 'Aktif' : 'Nonaktif'}
                          </Badge>
                        </TableCell>

                        {/* Pengukuran Terakhir */}
                        {/* <TableCell>
                          {pengukuran ? (
                            <div className="flex flex-col gap-1 max-w-40">
                              <div className="text-sm truncate">
                                {pengukuran.beratKg != null ? `${pengukuran.beratKg} kg` : '-'} / {pengukuran.tinggiCm != null ? `${pengukuran.tinggiCm} cm` : '-'}
                              </div>
                              <div className="text-xs text-muted-foreground">{pengukuran.tanggal ? fmtDateShort(pengukuran.tanggal) : '-'}</div>
                              <div className="text-xs text-muted-foreground">
                                {pengukuran.statusBBTB ? `BB/TB: ${pengukuran.statusBBTB}` : ''}
                                {pengukuran.statusBBU ? ` ${pengukuran.statusBBU}` : ''}
                                {pengukuran.statusTBU ? ` ${pengukuran.statusTBU}` : ''}
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground">Belum ada pengukuran</div>
                          )}
                        </TableCell> */}
                      </TableRow>
                    );
                  })
                )}
              </TableBody>

              <TableFooter>
                <TableRow>
                  <TableCell colSpan={7} className="p-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="inline-flex flex-col gap-2 rounded-lg border bg-muted/30 px-3 py-2">
                        <div className="text-xs text-muted-foreground">
                          {selectedItems.length} dipilih dari {allBalita.length} balita
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const selectedId = selectedItems[0];
                              if (selectedId) {
                                setSelectedIdForUpdate(selectedId);
                                setIsDetailOpen(true);
                              }
                            }}
                            disabled={selectedItems.length !== 1}
                          >
                            <EyeIcon className="size-4" />
                            Detail
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <Pagination>
                            <PaginationContent>
                              <PaginationItem>
                                <PaginationPrevious onClick={() => page > 1 && handlePageChange(page - 1)} className={page <= 1 ? 'pointer-events-none opacity-50' : ''} />
                              </PaginationItem>
                              <div className="flex items-center gap-1">{getPaginationItems()}</div>
                              <PaginationItem>
                                <PaginationNext onClick={() => page < pageCount && handlePageChange(page + 1)} className={page >= pageCount ? 'pointer-events-none opacity-50' : ''} />
                              </PaginationItem>
                            </PaginationContent>
                          </Pagination>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};
