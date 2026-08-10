import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Gamepad2,
  Settings,
  ShieldAlert,
  Award,
  Sparkles,
  FolderOpen,
  Calculator
} from 'lucide-react';

export const Sidebar = () => {
  const { profile } = useAuth();

  const navItems = [
    {
      title: 'Tổng quan (Dashboard)',
      path: '/dashboard',
      icon: LayoutDashboard,
      roles: ['admin', 'teacher', 'student']
    },
    {
      title: 'Quản lý Lớp học',
      path: '/classes',
      icon: Users,
      roles: ['admin', 'teacher', 'student']
    },
    {
      title: 'Bài tập 5-6 tuổi',
      path: '/exercises',
      icon: Calculator,
      roles: ['admin', 'teacher', 'student']
    },
    {
      title: 'Kho Học liệu',
      path: '/materials',
      icon: FolderOpen,
      roles: ['admin', 'teacher', 'student']
    },
    {
      title: 'Trò chơi Giáo dục',
      path: '/games',
      icon: Gamepad2,
      roles: ['admin', 'teacher', 'student']
    },
    {
      title: 'Trang cá nhân',
      path: '/profile',
      icon: Settings,
      roles: ['admin', 'teacher', 'student']
    }
  ];

  const filteredItems = navItems.filter(
    (item) => profile && item.roles.includes(profile.role)
  );

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between hidden md:flex">
      <div className="space-y-6">
        {/* Kid Banner / Role welcome card */}
        <div className="p-3.5 bg-gradient-to-br from-brand-50 to-indigo-50 border border-brand-100 rounded-2xl">
          <div className="flex items-center gap-3">
            <img
              src={profile?.avatar_url || 'https://api.dicebear.com/7.x/bottts/svg?seed=Kids'}
              alt="Avatar"
              className="w-10 h-10 rounded-full bg-white p-0.5 border border-brand-200 shadow-sm"
            />
            <div>
              <p className="text-xs font-black text-slate-800 line-clamp-1">
                {profile?.full_name || 'Học viên'}
              </p>
              <p className="text-[11px] text-brand-600 font-bold capitalize">
                {profile?.role === 'admin'
                  ? 'Quản trị hệ thống'
                  : profile?.role === 'teacher'
                  ? 'Giáo viên Tiền tiểu học'
                  : 'Học sinh 5-6 tuổi 🌟'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          <p className="px-3 text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2">
            Menu chính
          </p>
          {filteredItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.title}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-100 text-center">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500">
          <p className="font-extrabold text-slate-700">EdTech Tiền Tiểu Học v1.0</p>
          <p className="mt-0.5 text-slate-400">Dành cho trẻ 5-6 tuổi</p>
        </div>
      </div>
    </aside>
  );
};
