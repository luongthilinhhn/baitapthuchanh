import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { ClassCard } from '../../components/classes/ClassCard';
import { JoinClassModal } from '../../components/classes/JoinClassModal';
import { Modal } from '../../components/common/Modal';
import { Users, Plus, Key, Search, Sparkles } from 'lucide-react';

export const ClassList = () => {
  const { profile, isTeacher, isStudent } = useAuth();
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const [className, setClassName] = useState('');
  const [subject, setSubject] = useState('Toán học');
  const [gradeLevel, setGradeLevel] = useState('Khối 1');

  const [classesList, setClassesList] = useState([]);

  // Fetch live classes from Supabase
  const fetchClasses = async () => {
    setLoading(true);
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('classes')
          .select('*, profiles:teacher_id(full_name)');

        if (!error && data) {
          const formatted = data.map((c) => ({
            id: c.id,
            name: c.name,
            subject: c.subject,
            grade_level: c.grade_level,
            join_code: c.join_code,
            teacher_name: c.profiles?.full_name || 'Thầy/Cô Phụ Trách',
            student_count: 0,
            material_count: 0
          }));
          setClassesList(formatted);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error('Fetch classes error:', err);
      }
    }

    // Default seed fallback if DB has 0 items yet
    setClassesList([
      {
        id: 'cls-1',
        name: 'Lớp 1A - Toán Học Thông Minh',
        subject: 'Toán học',
        grade_level: 'Khối 1',
        join_code: 'MATH1A',
        teacher_name: 'Cô Nguyễn Thị Mai',
        student_count: 12,
        material_count: 5
      },
      {
        id: 'cls-2',
        name: 'Lớp 2B - Tiếng Việt & Từ Vựng',
        subject: 'Tiếng Việt',
        grade_level: 'Khối 2',
        join_code: 'TV2B88',
        teacher_name: 'Thầy Trần Hoàng',
        student_count: 15,
        material_count: 8
      }
    ]);
    setLoading(false);
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleCreateClass = async (e) => {
    e.preventDefault();
    const generatedCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const newClsData = {
      name: className,
      subject,
      grade_level: gradeLevel,
      join_code: generatedCode,
      teacher_id: profile?.id
    };

    if (isSupabaseConfigured && supabase && profile?.id) {
      const { data, error } = await supabase
        .from('classes')
        .insert([newClsData])
        .select()
        .single();

      if (!error && data) {
        await fetchClasses();
        setClassName('');
        setShowCreateModal(false);
        return;
      }
    }

    // Local append
    const localCls = {
      id: 'cls_' + Date.now(),
      ...newClsData,
      teacher_name: profile?.full_name || 'Thầy/Cô Phụ Trách',
      student_count: 0,
      material_count: 0
    };

    setClassesList([localCls, ...classesList]);
    setClassName('');
    setShowCreateModal(false);
  };

  const handleJoinByCode = async (code) => {
    if (isSupabaseConfigured && supabase && profile?.id) {
      // Find class by code
      const { data: foundClass, error: findErr } = await supabase
        .from('classes')
        .select('id')
        .eq('join_code', code)
        .single();

      if (findErr || !foundClass) {
        throw new Error('Mã lớp không tồn tại. Vui lòng kiểm tra lại!');
      }

      // Add to class members
      const { error: joinErr } = await supabase
        .from('class_members')
        .insert([{ class_id: foundClass.id, student_id: profile.id }]);

      if (joinErr && !joinErr.message.includes('duplicate')) {
        throw joinErr;
      }

      await fetchClasses();
    }
  };

  const filtered = classesList.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.join_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
            <Users className="w-7 h-7 text-brand-600" />
            Danh Sách Lớp Học
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý sĩ số, học sinh, bài học & mã gia nhập lớp.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isStudent && (
            <button
              onClick={() => setShowJoinModal(true)}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-xs rounded-2xl shadow-md transition-colors flex items-center gap-1.5"
            >
              <Key className="w-4 h-4" />
              <span>Gia Nhập Lớp Bằng Mã</span>
            </button>
          )}

          {isTeacher && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-2xl shadow-md shadow-brand-500/20 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo Lớp Học Mới</span>
            </button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm theo tên lớp, môn học hoặc mã Join Code..."
          className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-2xl focus:border-brand-500 outline-none shadow-sm"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-12 text-center text-xs font-semibold text-slate-400">
          Đang tải danh sách lớp từ cơ sở dữ liệu...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((cls) => (
            <ClassCard key={cls.id} classItem={cls} isTeacher={isTeacher} />
          ))}
        </div>
      )}

      {/* Create Class Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Tạo Lớp Học Mới">
        <form onSubmit={handleCreateClass} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Tên Lớp Học (*)</label>
            <input
              type="text"
              required
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="VD: Lớp 1A - Toán Học Thông Minh"
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Môn Học</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
              >
                <option value="Toán học">Toán học</option>
                <option value="Tiếng Việt">Tiếng Việt</option>
                <option value="Tiếng Anh">Tiếng Anh</option>
                <option value="Khoa học">Khoa học</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Khối Lớp</label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
              >
                <option value="5-6 tuổi (Tiền tiểu học)">5-6 tuổi (Tiền tiểu học)</option>
                <option value="Mẫu giáo lớn (5 tuổi)">Mẫu giáo lớn (5 tuổi)</option>
                <option value="Khối 1">Khối 1</option>
                <option value="Khối 2">Khối 2</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="flex-1 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 py-2 text-xs font-bold text-white bg-brand-600 rounded-xl hover:bg-brand-700 shadow-sm flex items-center justify-center gap-1"
            >
              <Sparkles className="w-4 h-4" />
              <span>Tạo Lớp</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Join Class Modal */}
      <JoinClassModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onJoin={handleJoinByCode}
      />
    </div>
  );
};
