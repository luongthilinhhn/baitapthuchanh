import React from 'react';
import {
  FileText,
  Video,
  FileSpreadsheet,
  FileCode,
  Download,
  Eye,
  Trash2,
  Lock,
  Globe,
  Users
} from 'lucide-react';
import { SubjectBadge, GradeBadge } from '../common/KidsBadge';

export const MaterialCard = ({ material, onDelete, isOwnerOrAdmin }) => {
  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-8 h-8 text-rose-500" />;
      case 'mp4':
      case 'video':
        return <Video className="w-8 h-8 text-sky-500" />;
      case 'pptx':
      case 'presentation':
        return <FileSpreadsheet className="w-8 h-8 text-amber-500" />;
      default:
        return <FileCode className="w-8 h-8 text-purple-500" />;
    }
  };

  const getPrivacyBadge = (privacy) => {
    switch (privacy) {
      case 'private':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
            <Lock className="w-3 h-3" /> Riêng tư
          </span>
        );
      case 'class':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
            <Users className="w-3 h-3" /> Lớp học
          </span>
        );
      case 'public':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <Globe className="w-3 h-3" /> Công khai
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 group-hover:bg-slate-100 transition-colors">
            {getFileIcon(material.file_type)}
          </div>
          {getPrivacyBadge(material.privacy_level)}
        </div>

        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <SubjectBadge subject={material.subject} />
          <GradeBadge grade={material.grade_level} />
        </div>

        <h4 className="text-base font-bold text-slate-800 line-clamp-1 group-hover:text-brand-600 transition-colors">
          {material.title}
        </h4>

        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
          {material.description || 'Chưa có mô tả chi tiết cho bài học này.'}
        </p>

        {material.tags && material.tags.length > 0 && (
          <div className="flex items-center gap-1.5 mt-3 flex-wrap">
            {material.tags.map((tag, idx) => (
              <span key={idx} className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] font-medium text-slate-400">
          {new Date(material.created_at).toLocaleDateString('vi-VN')}
        </span>

        <div className="flex items-center gap-1">
          <a
            href={material.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors"
            title="Xem / Tải về"
          >
            <Download className="w-4 h-4" />
          </a>

          {isOwnerOrAdmin && onDelete && (
            <button
              onClick={() => onDelete(material.id)}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              title="Xóa tài liệu"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
