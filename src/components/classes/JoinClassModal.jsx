import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Key, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export const JoinClassModal = ({ isOpen, onClose, onJoin }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('Vui lòng nhập mã lớp gồm 6 ký tự!');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await onJoin(code.trim().toUpperCase());
      setCode('');
      onClose();
    } catch (err) {
      setError(err.message || 'Mã lớp không hợp lệ hoặc bạn đã gia nhập lớp này.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Gia Nhập Lớp Học Mới" maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="text-center py-2">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Key className="w-8 h-8" />
          </div>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Nhập <strong>Mã Gia Nhập (Join Code)</strong> do Thầy/Cô cấp để vào lớp học ngay!
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 text-center">
            Mã Lớp Học (6 ký tự)
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="VD: MATH56"
            maxLength={10}
            className="w-full text-center text-2xl font-mono font-extrabold tracking-widest uppercase px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-brand-500 focus:bg-white outline-none transition-all"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{submitting ? 'Đang gia nhập...' : 'Vào Lớp Ngay'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
