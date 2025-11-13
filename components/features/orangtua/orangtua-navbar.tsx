'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Home, Users, FileText, Calendar, MapPin, LogOut, User } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { logout } from '@/actions/logout';
import { toast } from 'sonner';
import { useCurrentUser } from '@/actions/auth-client';

const MENU = [
  { title: 'Beranda', href: '/orangtua', icon: Home },
  { title: 'Daftar Anak', href: '/orangtua/anak', icon: Users },
  { title: 'Catatan Balita', href: '/orangtua/catatan', icon: FileText },
  { title: 'Jadwal Imunisasi', href: '/orangtua/jadwal', icon: Calendar },
  { title: 'Posyandu / Janji', href: '/orangtua/janji', icon: MapPin },
];

export const OrangTuaNavbar = () => {
  const user = useCurrentUser();

  const pathname = usePathname() ?? '/';
  const handleLogout = () => {
    // sesuaikan dengan flow auth lo (next-auth / custom). For now navigate to /logout route
    logout();
    toast.success('Logout Berhasil');
  };

  const initials = (user?.name || user?.email || 'U')
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="w-full bg-white border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LEFT: logo/title */}
          <div className="flex items-center gap-4">
            <Link href="/orangtua" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">PK</div>
              <div className="hidden sm:block">
                <div className="text-sm font-semibold text-slate-900">Puskesmas</div>
                <div className="text-xs text-slate-500">Orang Tua</div>
              </div>
            </Link>
          </div>

          {/* CENTER: desktop nav */}
          <nav className="hidden md:flex items-center gap-2">
            {MENU.map((m) => {
              const active = pathname === m.href;
              return (
                <Link key={m.href} href={m.href} className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition ${active ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-50'}`}>
                  <m.icon className="h-4 w-4" />
                  <span>{m.title}</span>
                </Link>
              );
            })}
          </nav>

          {/* RIGHT: avatar + dropdown (desktop) and hamburger (mobile) */}
          <div className="flex items-center gap-3">
            {/* Desktop dropdown */}
            <div className="hidden md:flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="inline-flex items-center gap-2 px-2 py-1 rounded-md hover:bg-slate-50">
                    <Avatar className="h-9 w-9">{user?.image ? <AvatarImage src={user.image} alt={user?.name ?? 'avatar'} /> : <AvatarFallback>{initials}</AvatarFallback>}</Avatar>
                    <div className="text-left">
                      <div className="text-sm font-medium text-slate-900">{user?.name ?? 'Pengguna'}</div>
                      <div className="text-xs text-slate-500">{user?.email ?? ''}</div>
                    </div>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2">
                    <div className="text-sm font-semibold">{user?.name ?? 'Pengguna'}</div>
                    <div className="text-xs text-slate-500 wrap-break-word">{user?.email ?? ''}</div>
                  </div>
                  <Separator />
                  <DropdownMenuItem asChild>
                    <Link href="/orangtua/profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile: hamburger -> sheet */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" className="p-2">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>

                <SheetContent side="bottom" className="h-[70vh]">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                    <SheetDescription className="mt-1">Navigasi cepat untuk orang tua</SheetDescription>
                  </SheetHeader>

                  <div className="mt-4 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">{user?.image ? <AvatarImage src={user.image} alt={user?.name ?? 'avatar'} /> : <AvatarFallback>{initials}</AvatarFallback>}</Avatar>
                      <div>
                        <div className="text-sm font-medium text-slate-900">{user?.name ?? 'Pengguna'}</div>
                        <div className="text-xs text-slate-500 wrap-break-word">{user?.email ?? ''}</div>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-2">
                      {MENU.map((m) => {
                        const active = pathname === m.href;
                        return (
                          <Link key={m.href} href={m.href} className={`flex items-center gap-3 px-3 py-3 rounded-md transition ${active ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-slate-50 text-slate-700'}`}>
                            <m.icon className="h-5 w-5" />
                            <span className="font-medium">{m.title}</span>
                          </Link>
                        );
                      })}
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-2">
                      <Link href="/orangtua/profile" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-50">
                        <User className="h-4 w-4" />
                        Profile
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-50 text-left">
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
