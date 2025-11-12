import { NavItem } from './types';

export const adminSideBarLink: NavItem[] = [
  {
    title: 'Pengguna',
    url: '/dashboard/users',
    icon: 'userPen',
    isActive: true,
  },
  {
    title: 'Balita',
    url: '/dashboard/balita',
    icon: 'baby',
  },
  // {
  //   title: 'Table',
  //   url: '#',
  //   icon: 'table',
  //   shortcut: ['u', 'u'],
  //   isActive: false,
  //   items: [
  //     {
  //       title: 'User',
  //       url: '/dashboard/users',
  //       icon: 'userPen',
  //       shortcut: ['m', 'm'],
  //     },
  //     {
  //       title: 'Project',
  //       url: '/dashboard/project',
  //       icon: 'userPen',
  //       shortcut: ['m', 'm'],
  //     },
  //     {
  //       title: 'Karir',
  //       url: '/dashboard/career',
  //       icon: 'userPen',
  //       shortcut: ['m', 'm'],
  //     },
  //     {
  //       title: 'Review',
  //       url: '/dashboard/review',
  //       icon: 'userPen',
  //       shortcut: ['m', 'm'],
  //     },
  //   ], // No child items
  // },
];
