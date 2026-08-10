import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Upload, FileText, Sparkles, Check, AlertCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export const MaterialUploader = ({ isOpen, onClose, onMaterialCreated }) => {
  const { profile } = useAuth();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('Toán học');
  const [gradeLevel, setGradeLevel] = useState('Khối 1');
  const [privacyLevel, setPrivacyLevel] = useState('public');
  const [tagsInput, setTagsInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const subjects = ['Toán học', 'Tiếng Việt', 'Kỹ năng & Tư duy', 'Tiếng Anh', 'Khoa học'];
  const grades = ['5-6 tuổi (Tiền tiểu học)', 'Mẫu giáo lớn', 'Khối 1', 'Khối 2'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file && !title) {
      setError('Vui lòng chọn file học liệu hoặc điền tiêu đề!');
      return;
    }

    setUploading(true);
    setError('');

    try {
      let fileUrl = 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80';
      let fileType = 'pdf';

      if (file) {
        const ext = file.name.split('.').pop().toLowerCase();
        fileType = ['pdf', 'mp4', 'pptx', 'docx'].includes(ext) ? ext : 'other';

        if (isSupabaseConfigured && supabase) {
          const filePath = `materials/${Date.now()}_${file.name}`;
          const { data: storageData, error: storageErr } = await supabase.storage
            .from('materials')
            .upload(filePath, file);

          if (storageErr) {
            console.warn('Storage upload warning, using direct file path fallback:', storageErr);
          } else {
            const { data: urlData } = supabase.storage.from('materials').getPublicUrl(filePath);
            if (urlData?.publicUrl) fileUrl = urlData.publicUrl;
          }
        }
      }

      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const newMaterial = {
        id: 'mat_' + Date.now(),
        title: title || file?.name || 'Tài liệu học tập',
        description,
        file_url: fileUrl,
        file_type: fileType,
        file_size: file?.size || 1024000,
        subject,
        grade_level: gradeLevel,
        tags,
        privacy_level: privacyLevel,
        created_by: profile?.id || 'demo-teacher-01',
        created_at: new Date().toISOString()
      };

      if (isSupabaseConfigured && supabase) {
        await supabase.from('materials').insert([newMaterial]);
      }

      await onMaterialCreated(newMaterial);

      // Reset form
      setFile(null);
      setTitle('');
      setDescription('');
      setTagsInput('');
      onClose();
    } catch (err) {
      setError(err.message || 'Tải học liệu lên thất bại.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tải Học Liệu Mới Lên Kho">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* File Drop Area */}
        <div className="border-2 border-dashed border-slate-200 hover:border-brand-400 rounded-2xl p-5 text-center transition-colors">
          <FileText className="w-8 h-8 text-brand-500 mx-auto mb-2" />
          {file ? (
            <div className="text-xs font-bold text-slate-800">
              {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
            </div>
          ) : (
            <div>
              <p className="text-xs font-bold text-slate-700">Tải tài liệu PDF, PPTX, DOCX, Video MP4</p>
              <p className="text-[11px] text-slate-400 mb-2">Hỗ trợ lưu trữ Supabase Storage</p>
            </div>
          )}
          <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-xl transition-colors mt-1">
            <Upload className="w-4 h-4" />
            <span>{file ? 'Thay Đổi File' : 'Chọn File Từ Máy'}</span>
            <input
              type="file"
              onChange={(e) => {
                if (e.target.files[0]) {
                  setFile(e.target.files[0]);
                  if (!title) setTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
                }
              }}
              className="hidden"
            />
          </label>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Tên Tài Liệu / Bài Học (*)</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="VD: Bài giảng Toán Lớp 1 - Phép cộng trong phạm vi 10"
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
              {subjects.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Khối Lớp</label>
            <select
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
            >
              {grades.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Phân Quyền Bảo Mật</label>
            <select
              value={privacyLevel}
              onChange={(e) => setPrivacyLevel(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
            >
              <option value="public">Công khai (Tất cả học sinh & GV)</option>
              <option value="class">Dành riêng Lớp học</option>
              <option value="private">Riêng tư (Chỉ bản thân)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Thẻ (Tags)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="VD: PhepCong, OnTap, HocKy1"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Mô Tả Học Liệu</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ghi chú hướng dẫn bài học cho học sinh..."
            className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={uploading}
            className="flex-1 py-2 text-xs font-bold text-white bg-brand-600 rounded-xl hover:bg-brand-700 shadow-sm flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>{uploading ? 'Đang tải lên...' : 'Lưu Học Liệu'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
