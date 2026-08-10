import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ClassCard } from '../../components/classes/ClassCard';
import { MaterialUploader } from '../../components/materials/MaterialUploader';
import { GameCreatorModal } from '../../components/games/GameCreatorModal';
import { Plus, BookOpen, Gamepad2, Users, Sparkles, Upload } from 'lucide-react';

export const TeacherDashboard = () => {
  const { profile } = useAuth();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showGameModal, setShowGameModal] = useState(false);

  const mockClasses = [
    {
      id: 'cls-1',
      name: 'Lớp 1A - Toán Học Thông Minh',
      subject: 'Toán học',
      grade_level: 'Khối 1',
      join_code: 'MATH1A',
      teacher_name: profile?.full_name || 'Cô Nguyễn Thị Mai',
      student_count: 12,
      material_count: 5
    },
    {
      id: 'cls-2',
      name: 'Lớp 2B - Tiếng Việt & Từ Vựng',
      subject: 'Tiếng Việt',
      grade_level: 'Khối 2',
      join_code: 'TV2B88',
      teacher_name: profile?.full_name || 'Cô Nguyễn Thị Mai',
      student_count: 15,
      material_count: 8
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 text-white p-6 rounded-3xl shadow-xl flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-100">Bảng Điều Khiển Giáo Viên</span>
          <h1 className="text-2xl font-extrabold mt-1">Xin chào, {profile?.full_name}! 👋</h1>
          <p className="text-xs text-brand-100 mt-1">Quản lý các Lớp học, đăng tải Học liệu và khởi tạo Game tương tác cho học sinh.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2.5 bg-white text-brand-700 hover:bg-brand-50 font-bold text-xs rounded-2xl shadow-md transition-colors flex items-center gap-1.5"
          >
            <Upload className="w-4 h-4 text-brand-600" />
            <span>Đăng Học Liệu</span>
          </button>
          <button
            onClick={() => setShowGameModal(true)}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-xs rounded-2xl shadow-md transition-colors flex items-center gap-1.5"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Tạo Game Mới</span>
          </button>
        </div>
      </div>

      {/* Classes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-600" />
            Lớp Học Đang Phụ Trách ({mockClasses.length})
          </h3>
          <Link
            to="/classes"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            Tạo Lớp Học Mới <Plus className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockClasses.map((cls) => (
            <ClassCard key={cls.id} classItem={cls} isTeacher={true} />
          ))}
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              Kho Học Liệu Vừa Đăng
            </h4>
            <Link to="/materials" className="text-xs font-bold text-purple-600">Xem kho</Link>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-2">
            <div className="flex justify-between font-bold text-slate-800">
              <span>📚 Phép cộng trong phạm vi 10 (PDF)</span>
              <span className="text-slate-400">Hôm nay</span>
            </div>
            <p className="text-slate-500 text-[11px]">Bài tập ôn tập môn Toán Lớp 1 - Đã giao cho Lớp 1A</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-emerald-600" />
              Trò Chơi Nổi Bật Dành Cho Trẻ
            </h4>
            <Link to="/games" className="text-xs font-bold text-emerald-600">Quản lý game</Link>
          </div>
          <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-xs space-y-2">
            <div className="flex justify-between font-bold text-emerald-900">
              <span>🎮 Lật Hình Từ Vựng Tiếng Anh (Memory)</span>
              <span className="text-emerald-700 font-extrabold">34 lượt chơi</span>
            </div>
            <p className="text-emerald-800 text-[11px]">Giúp trẻ ghi nhớ từ vựng qua hình ảnh trực quan.</p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <MaterialUploader
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onMaterialCreated={(m) => console.log('Created material:', m)}
      />

      <GameCreatorModal
        isOpen={showGameModal}
        onClose={() => setShowGameModal(false)}
        onGameCreated={(g) => console.log('Created game:', g)}
      />
    </div>
  );
};
