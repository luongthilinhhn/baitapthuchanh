import React from 'react';
import { Star, Award, Sparkles, Trophy } from 'lucide-react';

export const StarRating = ({ count = 3, size = 'md' }) => {
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3].map((star) => (
        <Star
          key={star}
          className={`${iconSizes[size]} transition-all duration-300 ${
            star <= count
              ? 'text-amber-400 fill-amber-400 animate-star-pop drop-shadow-[0_2px_4px_rgba(251,191,36,0.5)]'
              : 'text-slate-300 fill-slate-100'
          }`}
        />
      ))}
    </div>
  );
};

export const RoleBadge = ({ role }) => {
  const badgeStyles = {
    admin: 'bg-purple-100 text-purple-800 border-purple-200',
    teacher: 'bg-blue-100 text-blue-800 border-blue-200',
    student: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  };

  const labels = {
    admin: 'Quản trị viên',
    teacher: 'Giáo viên',
    student: 'Học sinh'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badgeStyles[role] || 'bg-slate-100 text-slate-700'}`}>
      <Sparkles className="w-3.5 h-3.5" />
      {labels[role] || role}
    </span>
  );
};

export const GradeBadge = ({ grade }) => {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
      <Award className="w-3 h-3 text-amber-500" />
      {grade}
    </span>
  );
};

export const SubjectBadge = ({ subject }) => {
  const colors = {
    'Toán học': 'bg-rose-50 text-rose-700 border-rose-200',
    'Tiếng Việt': 'bg-sky-50 text-sky-700 border-sky-200',
    'Tiếng Anh': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'Khoa học': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Lịch sử': 'bg-amber-50 text-amber-700 border-amber-200'
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold border ${colors[subject] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
      {subject}
    </span>
  );
};
