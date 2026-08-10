import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase, isSupabaseConfigured, logSystemAction } from '../../lib/supabase';
import {
  Users,
  BookOpen,
  Gamepad2,
  ShieldAlert,
  GraduationCap,
  Activity,
  Plus,
  Trash2,
  Key,
  Search,
  UserCheck,
  RefreshCw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { RoleBadge } from '../../components/common/KidsBadge';

export const AdminDashboard = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users' | 'logs'
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');

  const [stats, setStats] = useState({
    totalUsers: 0,
    teachers: 0,
    students: 0,
    admins: 0,
    classes: 0,
    materials: 0,
    games: 0
  });

  const [usersList, setUsersList] = useState([]);
  const [logsList, setLogsList] = useState([]);
  const [statusMsg, setStatusMsg] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchAdminData = async () => {
    setLoading(true);

    if (isSupabaseConfigured && supabase) {
      try {
        // Fetch profiles
        const { data: profilesData } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
        // Fetch classes count
        const { count: classesCount } = await supabase.from('classes').select('*', { count: 'exact', head: true });
        // Fetch materials count
        const { count: materialsCount } = await supabase.from('materials').select('*', { count: 'exact', head: true });
        // Fetch games count
        const { count: gamesCount } = await supabase.from('games').select('*', { count: 'exact', head: true });
        // Fetch logs
        const { data: logsData } = await supabase.from('system_logs').select('*, profiles(email, full_name)').order('created_at', { ascending: false }).limit(20);

        if (profilesData) {
          setUsersList(profilesData);
          const teachers = profilesData.filter(u => u.role === 'teacher').length;
          const students = profilesData.filter(u => u.role === 'student').length;
          const admins = profilesData.filter(u => u.role === 'admin').length;

          setStats({
            totalUsers: profilesData.length,
            teachers,
            students,
            admins,
            classes: classesCount || 0,
            materials: materialsCount || 0,
            games: gamesCount || 0
          });
        }

        if (logsData) {
          setLogsList(logsData);
        }

        setLoading(false);
        return;
      } catch (err) {
        console.error('Error loading admin data from Supabase:', err);
      }
    }

    // Fallback seed data if DB is empty or connecting for the first time
    const seedUsers = [
      { id: 'usr-admin-1', email: 'admin@edtech.edu.vn', full_name: 'Quản trị viên Trưởng', role: 'admin', created_at: '2026-08-01' },
      { id: 'usr-teacher-1', email: 'giaovien.nguyen@edtech.edu.vn', full_name: 'Cô Nguyễn Thị Mai', role: 'teacher', created_at: '2026-08-02' },
      { id: 'usr-student-1', email: 'hocsinh.an@edtech.edu.vn', full_name: 'Trần Văn An', role: 'student', created_at: '2026-08-03' },
      { id: 'usr-student-2', email: 'bao.le@edtech.edu.vn', full_name: 'Lê Minh Bảo', role: 'student', created_at: '2026-08-04' }
    ];
    setUsersList(seedUsers);
    setStats({
      totalUsers: 4,
      teachers: 1,
      students: 2,
      admins: 1,
      classes: 2,
      materials: 4,
      games: 3
    });
    setLogsList([
      { id: 1, action: 'USER_REGISTER', details: { email: 'hocsinh.an@edtech.edu.vn' }, created_at: new Date().toISOString() },
      { id: 2, action: 'CREATE_CLASS', details: { name: 'Lớp 1A - Toán Học' }, created_at: new Date().toISOString() }
    ]);
    setLoading(false);
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleChangeRole = async (userId, newRole) => {
    setUpdatingId(userId);
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase
          .from('profiles')
          .update({ role: newRole })
          .eq('id', userId);

        if (error) throw error;
        await logSystemAction(profile?.id, 'CHANGE_ROLE', { target_user_id: userId, new_role: newRole });
      }

      setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      setStatusMsg('Cập nhật vai trò người dùng thành công!');
      setTimeout(() => setStatusMsg(''), 2500);
    } catch (err) {
      alert('Lỗi cập nhật vai trò: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa người dùng "${userName}" khỏi hệ thống?`)) return;
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('profiles').delete().eq('id', userId);
        if (error) throw error;
        await logSystemAction(profile?.id, 'DELETE_USER', { target_user_id: userId, name: userName });
      }
      setUsersList(prev => prev.filter(u => u.id !== userId));
      setStatusMsg(`Đã xóa tài khoản ${userName}`);
      setTimeout(() => setStatusMsg(''), 2500);
    } catch (err) {
      alert('Lỗi xóa người dùng: ' + err.message);
    }
  };

  const filteredUsers = usersList.filter(u => {
    const matchesSearch = u.full_name?.toLowerCase().includes(userSearch.toLowerCase()) ||
                          u.email?.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-300">Bảng Điều Khiển Quản Trị Hệ Thống (System Admin)</span>
          <h1 className="text-2xl font-extrabold mt-1">Xin chào, {profile?.full_name}!</h1>
          <p className="text-xs text-purple-200 mt-1">Toàn quyền quản lý Người dùng, Phân quyền Roles, Lớp học, Kho Học liệu & Nhật ký Audit Log.</p>
        </div>
        <button
          onClick={fetchAdminData}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 backdrop-blur-sm transition-colors flex items-center gap-1.5 shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Làm mới dữ liệu</span>
        </button>
      </div>

      {statusMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 flex items-center gap-2 animate-pop">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'overview'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Tổng Quan Hệ Thống</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'users'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Quản Lý Người Dùng ({usersList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'logs'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Nhật Ký Audit Logs</span>
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-bold uppercase">Tổng Người Dùng</p>
                <p className="text-2xl font-black text-slate-800">{stats.totalUsers}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-bold uppercase">Lớp Học Active</p>
                <p className="text-2xl font-black text-slate-800">{stats.classes}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-bold uppercase">Kho Học Liệu</p>
                <p className="text-2xl font-black text-slate-800">{stats.materials}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-bold uppercase">Game Tương Tác</p>
                <p className="text-2xl font-black text-slate-800">{stats.games}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">👨‍🏫 Giáo Viên</span>
              <span className="text-lg font-black text-blue-600">{stats.teachers} người</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">👧 Học Sinh</span>
              <span className="text-lg font-black text-emerald-600">{stats.students} em</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">🛡️ Quản Trị Viên</span>
              <span className="text-lg font-black text-purple-600">{stats.admins} người</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: User Management */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Tìm theo Tên hoặc Email..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-purple-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Lọc theo Role:</span>
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl font-semibold outline-none"
              >
                <option value="all">Tất cả vai trò</option>
                <option value="admin">Admin</option>
                <option value="teacher">Giáo viên</option>
                <option value="student">Học sinh</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-4">Người Dùng</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Vai Trò Hiện Tại</th>
                  <th className="p-4 text-center">Đổi Phân Quyền</th>
                  <th className="p-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-800 flex items-center gap-3">
                      <img
                        src={u.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.id}`}
                        alt="Avatar"
                        className="w-8 h-8 rounded-full bg-slate-100 border"
                      />
                      <span>{u.full_name || 'Chưa cập nhật'}</span>
                    </td>
                    <td className="p-4 text-slate-500 font-mono">{u.email}</td>
                    <td className="p-4">
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="p-4 text-center">
                      <select
                        disabled={updatingId === u.id}
                        value={u.role}
                        onChange={(e) => handleChangeRole(u.id, e.target.value)}
                        className="px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold outline-none cursor-pointer focus:border-purple-500"
                      >
                        <option value="admin">Quản trị (Admin)</option>
                        <option value="teacher">Giáo viên (Teacher)</option>
                        <option value="student">Học sinh (Student)</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteUser(u.id, u.full_name || u.email)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Xóa tài khoản"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: System Logs */}
      {activeTab === 'logs' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-600" />
              Nhật Ký Hoạt Động Hệ Thống (System Audit Logs)
            </h3>
            <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              Live Realtime Feed
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {logsList.map((log) => (
              <div key={log.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-md font-mono text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-100">
                    {log.action}
                  </span>
                  <span className="font-medium text-slate-700">
                    {typeof log.details === 'string' ? log.details : JSON.stringify(log.details)}
                  </span>
                </div>
                <span className="text-slate-400 font-mono text-[11px]">
                  {log.created_at ? new Date(log.created_at).toLocaleTimeString() : 'Vừa xong'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

