import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { StudentImportModal } from '../../components/classes/StudentImportModal';
import { MaterialCard } from '../../components/materials/MaterialCard';
import { SubjectBadge, GradeBadge } from '../../components/common/KidsBadge';
import {
  Users,
  UserPlus,
  BookOpen,
  Gamepad2,
  Key,
  ArrowLeft,
  Mail,
  Trash2,
  FileSpreadsheet,
  Play
} from 'lucide-react';

export const ClassDetail = () => {
  const { classId } = useParams();
  const { profile, isTeacher } = useAuth();
  const [showImportModal, setShowImportModal] = useState(false);
  const [activeTab, setActiveTab] = useState('roster'); // 'roster' | 'materials' | 'games'

  const [classInfo, setClassInfo] = useState({
    id: classId || 'cls-1',
    name: 'Lớp 1A - Toán Học Thông Minh',
    subject: 'Toán học',
    grade_level: 'Khối 1',
    join_code: 'MATH1A',
    teacher_name: 'Cô Nguyễn Thị Mai'
  });

  const [students, setStudents] = useState([
    { id: 's-1', full_name: 'Trần Văn An', email: 'hocsinh.an@edtech.edu.vn', stars: 8, joined_at: '2026-08-01' },
    { id: 's-2', full_name: 'Lê Minh Bảo', email: 'bao.le@edtech.edu.vn', stars: 12, joined_at: '2026-08-02' },
    { id: 's-3', full_name: 'Phạm Ngọc Chi', email: 'chi.pham@edtech.edu.vn', stars: 5, joined_at: '2026-08-03' }
  ]);

  const [assignedMaterials, setAssignedMaterials] = useState([
    {
      id: 'm-1',
      title: 'Bài giảng Toán Lớp 1 - Phép cộng trong phạm vi 10',
      description: 'Slide trình chiếu bài học và các ví dụ minh họa bằng hình ảnh.',
      file_url: '#',
      file_type: 'pdf',
      subject: 'Toán học',
      grade_level: 'Khối 1',
      privacy_level: 'class',
      created_at: '2026-08-05'
    }
  ]);

  const handleAddStudents = (newStudentsList) => {
    const formatted = newStudentsList.map((s, idx) => ({
      id: 's_' + Date.now() + '_' + idx,
      full_name: s.full_name || s.email.split('@')[0],
      email: s.email,
      stars: 0,
      joined_at: new Date().toISOString().split('T')[0]
    }));
    setStudents([...students, ...formatted]);
  };

  const handleRemoveStudent = (studentId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa học sinh này khỏi lớp?')) {
      setStudents(students.filter((s) => s.id !== studentId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <Link to="/classes" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800">
        <ArrowLeft className="w-4 h-4" /> Quay lại danh sách lớp
      </Link>

      {/* Class Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <SubjectBadge subject={classInfo.subject} />
            <GradeBadge grade={classInfo.grade_level} />
            <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
              <Key className="w-3.5 h-3.5" /> Mã: {classInfo.join_code}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800">{classInfo.name}</h1>
          <p className="text-xs text-slate-500 mt-1">
            Giáo viên phụ trách: <strong className="text-slate-700">{classInfo.teacher_name}</strong>
          </p>
        </div>

        {isTeacher && (
          <button
            onClick={() => setShowImportModal(true)}
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-2xl shadow-md shadow-brand-500/20 transition-all flex items-center gap-2 shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Thêm / Import Học Sinh</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab('roster')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'roster'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Danh Sách Học Sinh ({students.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('materials')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'materials'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Học Liệu Đã Giao ({assignedMaterials.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'roster' ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="p-4">Học Sinh</th>
                <th className="p-4">Email</th>
                <th className="p-4">Ngày Gia Nhập</th>
                <th className="p-4 text-center">Sao Đạt Được</th>
                {isTeacher && <th className="p-4 text-right">Thao Tác</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
              {students.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-800 flex items-center gap-3">
                    <img
                      src={`https://api.dicebear.com/7.x/bottts/svg?seed=${st.full_name}`}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full bg-slate-100 border"
                    />
                    <span>{st.full_name}</span>
                  </td>
                  <td className="p-4 text-slate-500">{st.email}</td>
                  <td className="p-4 text-slate-400 font-mono">{st.joined_at}</td>
                  <td className="p-4 text-center font-bold text-amber-600">
                    ⭐ {st.stars} Sao
                  </td>
                  {isTeacher && (
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleRemoveStudent(st.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Xóa khỏi lớp"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assignedMaterials.map((mat) => (
            <MaterialCard key={mat.id} material={mat} isOwnerOrAdmin={isTeacher} />
          ))}
        </div>
      )}

      {/* Import Modal */}
      <StudentImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onAddStudents={handleAddStudents}
      />
    </div>
  );
};
