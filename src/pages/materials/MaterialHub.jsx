import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { MaterialCard } from '../../components/materials/MaterialCard';
import { MaterialUploader } from '../../components/materials/MaterialUploader';
import { FolderOpen, Plus, Search, Filter, Sparkles } from 'lucide-react';

export const MaterialHub = () => {
  const { profile, isTeacher } = useAuth();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('Tất cả');
  const [selectedGrade, setSelectedGrade] = useState('Tất cả');
  const [loading, setLoading] = useState(true);

  const [materials, setMaterials] = useState([]);

  const fetchMaterials = async () => {
    setLoading(true);
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('materials')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          setMaterials(data);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error('Error fetching materials:', err);
      }
    }

    // Default seed fallback if DB is empty
    setMaterials([
      {
        id: 'm-1',
        title: 'Bài giảng Toán Lớp 1 - Phép cộng trong phạm vi 10',
        description: 'Slide trình chiếu bài học và các ví dụ minh họa bằng hình ảnh.',
        file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        file_type: 'pdf',
        subject: 'Toán học',
        grade_level: 'Khối 1',
        tags: ['PhepCong', 'Toan1'],
        privacy_level: 'public',
        created_at: '2026-08-05'
      },
      {
        id: 'm-2',
        title: 'Bảng chữ cái Tiếng Việt & Quy tắc ghép vần',
        description: 'Tài liệu hướng dẫn phát âm chuẩn cho học sinh tiểu học.',
        file_url: '#',
        file_type: 'pptx',
        subject: 'Tiếng Việt',
        grade_level: 'Khối 1',
        tags: ['TiengViet', 'ChuCai'],
        privacy_level: 'public',
        created_at: '2026-08-06'
      },
      {
        id: 'm-3',
        title: 'Video hướng dẫn từ vựng Tiếng Anh chủ đề Động vật 🐶',
        description: 'Video ngắn sinh động phát âm chuẩn giọng Anh-Mỹ.',
        file_url: '#',
        file_type: 'mp4',
        subject: 'Tiếng Anh',
        grade_level: 'Khối 2',
        tags: ['English', 'Animals'],
        privacy_level: 'public',
        created_at: '2026-08-07'
      }
    ]);
    setLoading(false);
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleMaterialCreated = async (newMaterial) => {
    await fetchMaterials();
  };

  const handleDeleteMaterial = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa tài liệu này?')) {
      if (isSupabaseConfigured && supabase) {
        await supabase.from('materials').delete().eq('id', id);
      }
      setMaterials(materials.filter((m) => m.id !== id));
    }
  };

  const filtered = materials.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'Tất cả' || m.subject === selectedSubject;
    const matchesGrade = selectedGrade === 'Tất cả' || m.grade_level === selectedGrade;
    return matchesSearch && matchesSubject && matchesGrade;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
            <FolderOpen className="w-7 h-7 text-brand-600" />
            Kho Học Liệu Giáo Dục
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Lưu trữ PDF, Bài giảng PPTX, Video MP4 phân loại theo Khối lớp & Môn học.
          </p>
        </div>

        {isTeacher && (
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-2xl shadow-md shadow-brand-500/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Tải Học Liệu Lên</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên bài học, từ khóa..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none"
          >
            <option value="Tất cả">Tất cả Môn học</option>
            <option value="Toán học">Toán học</option>
            <option value="Tiếng Việt">Tiếng Việt</option>
            <option value="Tiếng Anh">Tiếng Anh</option>
            <option value="Khoa học">Khoa học</option>
          </select>

          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none"
          >
            <option value="Tất cả">Tất cả Độ tuổi / Khối lớp</option>
            <option value="5-6 tuổi">5-6 tuổi (Tiền tiểu học)</option>
            <option value="Khối 1">Khối 1</option>
            <option value="Khối 2">Khối 2</option>
          </select>
        </div>
      </div>

      {/* Grid Materials */}
      {loading ? (
        <div className="py-12 text-center text-xs font-semibold text-slate-400">
          Đang tải dữ liệu từ Kho Học liệu Supabase...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((mat) => (
            <MaterialCard
              key={mat.id}
              material={mat}
              onDelete={handleDeleteMaterial}
              isOwnerOrAdmin={isTeacher}
            />
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <MaterialUploader
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onMaterialCreated={handleMaterialCreated}
      />
    </div>
  );
};
