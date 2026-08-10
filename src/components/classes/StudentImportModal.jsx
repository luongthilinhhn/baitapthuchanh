import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Upload, UserPlus, FileSpreadsheet, Check, AlertCircle, FileText } from 'lucide-react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export const StudentImportModal = ({ isOpen, onClose, onAddStudents }) => {
  const [activeTab, setActiveTab] = useState('single'); // 'single' | 'file'
  const [studentEmail, setStudentEmail] = useState('');
  const [studentName, setStudentName] = useState('');
  const [parsedStudents, setParsedStudents] = useState([]);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setError('');
    const ext = file.name.split('.').pop().toLowerCase();

    if (ext === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const list = results.data
            .map((row) => ({
              email: row.Email || row.email || row.EMAIL,
              full_name: row.HoTen || row.full_name || row['Họ và Tên'] || row.Name
            }))
            .filter((item) => item.email);

          if (list.length === 0) {
            setError('Không tìm thấy cột Email trong file CSV!');
          } else {
            setParsedStudents(list);
          }
        }
      });
    } else if (ext === 'xlsx' || ext === 'xls') {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        const list = data
          .map((row) => ({
            email: row.Email || row.email || row.EMAIL,
            full_name: row.HoTen || row.full_name || row['Họ và Tên'] || row.Name
          }))
          .filter((item) => item.email);

        if (list.length === 0) {
          setError('Không tìm thấy cột Email trong file Excel!');
        } else {
          setParsedStudents(list);
        }
      };
      reader.readAsBinaryString(file);
    } else {
      setError('Chỉ hỗ trợ file dạng .csv, .xlsx, .xls');
    }
  };

  const handleAddSingle = async (e) => {
    e.preventDefault();
    if (!studentEmail.trim()) {
      setError('Vui lòng nhập Email học sinh!');
      return;
    }
    try {
      await onAddStudents([
        {
          email: studentEmail.trim(),
          full_name: studentName.trim() || studentEmail.split('@')[0]
        }
      ]);
      setSuccessMsg(`Đã thêm thành công học sinh ${studentEmail}`);
      setStudentEmail('');
      setStudentName('');
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1200);
    } catch (err) {
      setError(err.message || 'Thêm học sinh thất bại.');
    }
  };

  const handleAddBatch = async () => {
    if (parsedStudents.length === 0) {
      setError('Chưa chọn danh sách học sinh từ file!');
      return;
    }

    try {
      await onAddStudents(parsedStudents);
      setSuccessMsg(`Đã import thành công ${parsedStudents.length} học sinh vào lớp!`);
      setParsedStudents([]);
      setFileName('');
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1200);
    } catch (err) {
      setError(err.message || 'Import danh sách thất bại.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Thêm Học Sinh Vào Lớp">
      <div className="space-y-4">
        {/* Tabs */}
        <div className="flex border-b border-slate-100">
          <button
            onClick={() => {
              setActiveTab('single');
              setError('');
            }}
            className={`flex-1 py-2.5 text-xs font-bold text-center border-b-2 transition-colors ${
              activeTab === 'single'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Thêm Trực Tiếp (Email)
          </button>
          <button
            onClick={() => {
              setActiveTab('file');
              setError('');
            }}
            className={`flex-1 py-2.5 text-xs font-bold text-center border-b-2 transition-colors ${
              activeTab === 'file'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Import File Excel / CSV
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {activeTab === 'single' ? (
          <form onSubmit={handleAddSingle} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Học Sinh (*)
              </label>
              <input
                type="email"
                required
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                placeholder="hocsinh.an@edtech.edu.vn"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Họ và Tên Học Sinh
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Trần Văn An"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
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
                className="flex-1 py-2 text-xs font-bold text-white bg-brand-600 rounded-xl hover:bg-brand-700 shadow-sm"
              >
                Thêm Học Sinh
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 pt-2">
            <div className="border-2 border-dashed border-slate-200 hover:border-brand-400 rounded-2xl p-6 text-center transition-colors">
              <FileSpreadsheet className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700 mb-1">
                Tải lên file Excel (.xlsx) hoặc CSV
              </p>
              <p className="text-[11px] text-slate-400 mb-4">
                File cần có cột "Email" và "HoTen" (hoặc "Full_name").
              </p>
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-xl transition-colors">
                <Upload className="w-4 h-4" />
                <span>Chọn File Từ Máy Tính</span>
                <input
                  type="file"
                  accept=".csv, .xlsx, .xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {fileName && (
              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 truncate">{fileName}</span>
                <span className="text-emerald-600 font-bold">
                  {parsedStudents.length} học sinh tìm thấy
                </span>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={parsedStudents.length === 0}
                onClick={handleAddBatch}
                className="flex-1 py-2 text-xs font-bold text-white bg-brand-600 rounded-xl hover:bg-brand-700 shadow-sm disabled:opacity-50"
              >
                Import ({parsedStudents.length})
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
