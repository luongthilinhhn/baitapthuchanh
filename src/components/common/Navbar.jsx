import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { RoleBadge } from './KidsBadge';
import {
  GraduationCap,
  LogOut,
  User,
  Search,
  ChevronDown,
  Sparkles,
  BookOpen,
  Gamepad2,
  Users,
  ShieldAlert,
  Bell
} from 'lucide-react';

export const Navbar = ({ toggleSidebar }) => {
  const { profile, signOut, switchDemoUser, isStudent } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="font-extrabold text-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  PrimaryEd<span className="text-amber-500">Hub</span>
                </span>
                <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 -mt-1">
                  Kho Học Liệu & Game Tiểu Học
                </span>
              </div>
            </Link>
          </div>

          {/* Center Search / Shortcuts */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm môn học, tài liệu, game tương tác..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100/80 border border-transparent rounded-full focus:bg-white focus:border-brand-300 focus:ring-4 focus:ring-brand-100 outline-none transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Quick Role Switcher for Testing/Demo */}
            <div className="relative">
              <button
                onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors"
                title="Chuyển đổi quyền nhanh (Demo)"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Đổi Vai Trò</span>
                <ChevronDown className="w-3 h-3 text-amber-600" />
              </button>

              {showRoleSwitcher && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50 animate-pop">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Thử nghiệm vai trò:
                  </div>
                  <button
                    onClick={() => {
                      switchDemoUser('admin');
                      setShowRoleSwitcher(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-purple-700 hover:bg-purple-50 flex items-center justify-between"
                  >
                    <span>Quản trị viên (Admin)</span>
                    <ShieldAlert className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      switchDemoUser('teacher');
                      setShowRoleSwitcher(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-blue-700 hover:bg-blue-50 flex items-center justify-between"
                  >
                    <span>Giáo viên (Teacher)</span>
                    <BookOpen className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      switchDemoUser('student');
                      setShowRoleSwitcher(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-50 flex items-center justify-between"
                  >
                    <span>Học sinh (Student)</span>
                    <Gamepad2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
            </button>

            {/* User Profile */}
            {profile ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2.5 p-1 rounded-full hover:bg-slate-100 transition-colors border border-slate-200/60"
                >
                  <img
                    src={profile.avatar_url || 'https://api.dicebear.com/7.x/bottts/svg?seed=User'}
                    alt={profile.full_name}
                    className="w-8 h-8 rounded-full bg-slate-200 border border-brand-200"
                  />
                  <div className="hidden sm:block text-left pr-1">
                    <span className="block text-xs font-bold text-slate-800 leading-tight">
                      {profile.full_name}
                    </span>
                    <RoleBadge role={profile.role} />
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
                </button>

                {/* Profile Dropdown */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-pop">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-400 font-medium">Đăng nhập với email:</p>
                      <p className="text-xs font-bold text-slate-800 truncate">{profile.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>Trang cá nhân & Cài đặt</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors border-t border-slate-100"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-bold text-brand-600 hover:bg-brand-50 rounded-xl transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md shadow-brand-500/20 transition-all"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
