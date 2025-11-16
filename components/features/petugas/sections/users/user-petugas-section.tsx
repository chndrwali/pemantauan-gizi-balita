'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DEFAULT_LIMIT } from '@/lib/utils';
import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { EyeIcon, Filter, Search, X } from 'lucide-react';
import { Suspense, useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
// import { toast } from 'sonner';
import { UserDetailModal } from '@/components/features/dashboard/sections/users/user-detail-modal';

export const UsersPetugasSection = () => {
  return (
    <Suspense fallback={<UsersPetugasSectionSkeleton />}>
      <ErrorBoundary fallback={<p className="p-6 text-sm text-destructive">Terjadi Kesalahan...</p>}>
        <UsersPetugasSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const UsersPetugasSectionSkeleton = () => {
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

const UsersPetugasSectionSuspense = () => {
  const trpc = useTRPC();

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [role, setRole] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedIdForUpdate, setSelectedIdForUpdate] = useState<string>('');

  const { data } = useSuspenseQuery(
    trpc.usersPetugas.getMany.queryOptions({
      limit: DEFAULT_LIMIT,
      role: role ? (role as 'KADER' | 'PETUGAS' | 'ORANGTUA') : undefined,
      search: debouncedSearch || undefined,
    })
  );

  const allUsers = data.items || [];
  const pageCount = 1;

  const toggleSelectAll = () => {
    const selectableUsers = allUsers.filter((user) => user.role !== 'PUSKESMAS');
    if (selectedItems.length === selectableUsers.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(allUsers.map((user) => user.id));
    }
  };

  const toggleSelectItem = (id: string) => {
    const user = allUsers.find((user) => user.id === id);
    if (user?.role === 'PUSKESMAS') return;
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
  }, [role, debouncedSearch]);

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
      <UserDetailModal id={selectedIdForUpdate} open={isDetailOpen} onOpenChange={setIsDetailOpen} />
      <div className="px-6">
        {/* Filters */}
        <div className="mb-3 grid gap-3 sm:grid-cols-3">
          <div className="flex flex-col gap-1">
            <Label htmlFor="search">Cari (nama / email / username)</Label>
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2">
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

          <div className="flex flex-col gap-1">
            <Label>Pilih Role</Label>
            <Select value={role ?? ''} onValueChange={(v) => setRole(v || undefined)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Semua" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="KADER">KADER</SelectItem>
                <SelectItem value="PETUGAS">PETUGAS</SelectItem>
                <SelectItem value="ORANGTUA">ORANGTUA</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end gap-2">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => {
                setRole(undefined);
                setSearch('');
              }}
            >
              <Filter className="mr-2 h-4 w-4" />
              Reset Filter
            </Button>
          </div>
        </div>

        <div className="rounded-md border shadow-sm">
          <div className="overflow-x-auto">
            <Table className="min-w-[1200px]">
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="w-12sticky left-0 bg-muted/40 backdrop-blur supports-backdrop-filter:bg-muted/60 z-10">
                    <Checkbox checked={allUsers.length > 0 && selectedItems.length === allUsers.length} onCheckedChange={toggleSelectAll} aria-label="Select all items" />
                  </TableHead>
                  <TableHead className="min-w-[220px]">Identitas</TableHead>
                  <TableHead className="min-w-40">Kontak</TableHead>
                  <TableHead className="min-w-[120px]">Tipe Pengguna</TableHead>
                  <TableHead className="min-w-[220px]">Alamat</TableHead>
                  <TableHead className="min-w-[140px]">Wilayah</TableHead>
                  <TableHead className="min-w-[140px]">SIP</TableHead>
                  <TableHead className="min-w-[140px]">Dibuat</TableHead>
                  <TableHead className="min-w-[140px]">Diubah</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="sticky left-0 bg-background z-10">
                      <Checkbox checked={selectedItems.includes(user.id)} onCheckedChange={() => toggleSelectItem(user.id)} aria-label={`Select ${user.name}`} />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 max-w-[260px]">
                        <div className="font-medium leading-tight truncate" title={user.name ?? ''}>
                          {user.name ?? '-'}
                        </div>
                        <div className="text-xs text-muted-foreground truncate" title={user.username ?? ''}>
                          @{user.username ?? '-'}
                        </div>
                        <div className="text-xs text-muted-foreground truncate" title={user.nik ?? ''}>
                          NIK: {user.nik ?? '-'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 max-w-[220px]">
                        <div className="text-sm truncate" title={user.email ?? ''}>
                          {user.email ?? '-'}
                        </div>
                        <div className="text-xs text-muted-foreground truncate" title={user.phone ?? ''}>
                          {user.phone ?? '-'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="uppercase">
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[260px] truncate" title={user.address ?? ''}>
                        {user.address ?? '-'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        RT/RW: {user.rt ?? '-'} / {user.rw ?? '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm truncate max-w-[200px]" title={[user.kelurahan, user.kecamatan].filter(Boolean).join(', ')}>
                        {[user.kelurahan, user.kecamatan].filter(Boolean).join(', ') || '-'}
                      </div>
                      <div className="text-xs text-muted-foreground">Kode: {user.kodeWilayah ?? '-'}</div>
                    </TableCell>
                    <TableCell>{user.nomorSIP ?? '-'}</TableCell>
                    <TableCell>{format(new Date(user.createdAt), 'd MMM yyyy')}</TableCell>
                    <TableCell>{format(new Date(user.updatedAt), 'd MMM yyyy')}</TableCell>
                  </TableRow>
                ))}
                {allUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-6 text-muted-foreground">
                      Tidak ada user ditemukan
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={10} className="p-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="inline-flex flex-col gap-2 rounded-lg border bg-muted/30 px-3 py-2">
                        <div className="text-xs text-muted-foreground">
                          {selectedItems.length} dipilih dari {allUsers.length} akun
                        </div>
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
                          <EyeIcon className="size-4" /> Detail Pengguna
                        </Button>
                      </div>
                      <div className="flex items-center">
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
