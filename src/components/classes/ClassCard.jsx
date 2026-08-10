import React from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, Key, ChevronRight, Award } from 'lucide-react';
import { SubjectBadge, GradeBadge } from '../common/KidsBadge';

export const ClassCard = ({ classItem, isTeacher, isAdmin }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <SubjectBadge subject={classItem.subject} />
            <GradeBadge grade={classItem.grade_level} />
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            <Key className="w-3 h-3 text-amber-500" />
            {classItem.join_code}
          </span>
        </div>

        <Link
          to={`/classes/${classItem.id}`}
          className="text-lg font-bold text-slate-800 group-hover:text-brand-600 transition-colors line-clamp-1"
        >
          {classItem.name}
        </Link>

        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
          <span>Giáo viên phụ trách:</span>
          <span className="font-semibold text-slate-700">
            {classItem.teacher_name || 'Thầy/Cô Phụ Trách'}
          </span>
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4 text-brand-500" />
            {classItem.student_count || 0} học sinh
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="w-4 h-4 text-purple-500" />
            {classItem.material_count || 0} bài học
          </span>
        </div>

        <Link
          to={`/classes/${classItem.id}`}
          className="p-2 text-slate-400 group-hover:text-brand-600 group-hover:bg-brand-50 rounded-xl transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
};
