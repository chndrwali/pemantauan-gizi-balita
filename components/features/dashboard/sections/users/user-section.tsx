'use client';

import { AlertBulkDelete } from '@/components/alert-bulk-delete';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserAvatar } from '@/components/user-avatar';
import { AVATAR_FALLBACK, DEFAULT_LIMIT } from '@/lib/utils';
import { useTRPC } from '@/trpc/client';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Trash2Icon } from 'lucide-react';
import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { toast } from 'sonner';

export const UsersSection = () => {
  return (
    <Suspense fallback={<UsersSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <UsersSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const UsersSectionSkeleton = () => {
  return (
    <>
      <div className="border-y">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6 w-[510px]">User</TableHead>
              <TableHead>Role</TableHead>

              <TableHead>Dibuat</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell className="pl-6">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-20 w-36" />
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-[100px]" />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

const UsersSectionSuspense = () => {
  const trpc = useTRPC();

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [page, setPage] = useState(1);
  const { data } = useSuspenseQuery(
    trpc.usersAdmin.getMany.queryOptions({
      limit: DEFAULT_LIMIT,
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

  const bulkDelete = useMutation(
    trpc.usersAdmin.bulkDelete.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Berhasil hapus ${data.deletedCount} akun`);
        setSelectedItems([]);
      },
      onError: (error) => {
        toast.error(`${error.message || 'Gagal hapus project'}`);
      },
    })
  );

  const handleDelete = () => {
    if (selectedItems.length === 0) {
      toast.error('Tidak ada item yang di pilih');
      return;
    }

    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    bulkDelete.mutate({ ids: selectedItems });
    setIsConfirmOpen(false);
  };

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
    <Card>
      <AlertBulkDelete open={isConfirmOpen} onOpenChange={setIsConfirmOpen} selectedItems={selectedItems.length} confirmDelete={confirmDelete} />
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox checked={allUsers.length > 0 && selectedItems.length === allUsers.length} onCheckedChange={toggleSelectAll} aria-label="Select all items" />
                </TableHead>
                <TableHead className="w-[310px]">User</TableHead>
                <TableHead>Role</TableHead>

                <TableHead>Dibuat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox checked={selectedItems.includes(user.id)} onCheckedChange={() => toggleSelectItem(user.id)} aria-label={`Select ${user.name}`} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <UserAvatar imageUrl={user.image || AVATAR_FALLBACK} name={user.name || 'name'} size="lg" />
                      <div className="flex flex-col  overflow-hidden gap-y-1">
                        <span className="text-sm line-clamp-1">{user.name || 'no name'}</span>
                        <span className="text-xs  text-muted-foreground line-clamp-1">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="uppercase">{user.role}</span>
                  </TableCell>
                  <TableCell>{format(new Date(user.createdAt), 'd MMM yyyy')}</TableCell>
                </TableRow>
              ))}
              {allUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    Tidak ada user ditemukan
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={6} className="p-2">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      {selectedItems.length} dari {allUsers.length} item dipilih
                    </div>
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
                    <Button variant="destructive" size="sm" onClick={handleDelete} disabled={selectedItems.length === 0 || bulkDelete.isPending}>
                      {bulkDelete.isPending ? (
                        <span className="flex items-center gap-2">
                          <Spinner />
                          Deleting...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Trash2Icon className="h-4 w-4" />
                          Hapus yang Dipilih
                        </span>
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
