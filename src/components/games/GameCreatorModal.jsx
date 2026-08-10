import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Gamepad2, Plus, Sparkles, AlertCircle, Trash2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export const GameCreatorModal = ({ isOpen, onClose, onGameCreated }) => {
  const { profile } = useAuth();
  const [title, setTitle] = useState('');
  const [gameType, setGameType] = useState('matching'); // 'matching' | 'quiz' | 'math_speed'
  const [subject, setSubject] = useState('Toán học');
  const [gradeLevel, setGradeLevel] = useState('Khối 1');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  // Sample pair builder for Matching Game
  const [pairs, setPairs] = useState([
    { text1: 'Quả Táo 🍎', text2: 'Apple 🍏' },
    { text1: 'Con Mèo 🐱', text2: 'Cat 🐈' }
  ]);

  const addPair = () => {
    setPairs([...pairs, { text1: '', text2: '' }]);
  };

  const removePair = (idx) => {
    setPairs(pairs.filter((_, i) => i !== idx));
  };

  const updatePair = (idx, field, val) => {
    const next = [...pairs];
    next[idx][field] = val;
    setPairs(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Vui lòng nhập tên trò chơi!');
      return;
    }

    setCreating(true);
    setError('');

    try {
      let config = {};

      if (gameType === 'matching') {
        const formattedPairs = [];
        pairs.forEach((p, idx) => {
          if (p.text1 && p.text2) {
            formattedPairs.push({ id: idx * 2 + 1, text: p.text1, matchId: idx + 1 });
            formattedPairs.push({ id: idx * 2 + 2, text: p.text2, matchId: idx + 1 });
          }
        });
        config = { pairs: formattedPairs };
      }

      const newGame = {
        id: 'game_' + Date.now(),
        title,
        description,
        game_type: gameType,
        config,
        subject,
        grade_level: gradeLevel,
        privacy_level: 'public',
        created_by: profile?.id || 'demo-teacher-01',
        created_at: new Date().toISOString()
      };

      if (isSupabaseConfigured && supabase) {
        await supabase.from('games').insert([newGame]);
      }

      await onGameCreated(newGame);
      onClose();
    } catch (err) {
      setError(err.message || 'Tạo trò chơi thất bại.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tạo Trò Chơi Học Tập Mới">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Tên Trò Chơi (*)</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="VD: Lật Hình Học Từ Vựng Tiếng Anh Lớp 1"
            className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Loại Game</label>
            <select
              value={gameType}
              onChange={(e) => setGameType(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
            >
              <option value="matching">Lật Hình Ghép Cặp</option>
              <option value="quiz">Trắc Nghiệm Trực Quan</option>
              <option value="math_speed">Tính Nhanh Siêu Tốc</option>
            </select>
          </div>

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
              <option value="Khối 1">Khối 1</option>
              <option value="Khối 2">Khối 2</option>
              <option value="Khối 3">Khối 3</option>
              <option value="Khối 4">Khối 4</option>
              <option value="Khối 5">Khối 5</option>
            </select>
          </div>
        </div>

        {/* Dynamic pair configuration for matching game */}
        {gameType === 'matching' && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Các Cặp Ghép Đối Ứng</label>
              <button
                type="button"
                onClick={addPair}
                className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Thêm Cặp Mới
              </button>
            </div>

            {pairs.map((p, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Thẻ A (VD: Quả Táo)"
                  value={p.text1}
                  onChange={(e) => updatePair(idx, 'text1', e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
                <span className="text-xs text-slate-400 font-bold">↔️</span>
                <input
                  type="text"
                  placeholder="Thẻ B (VD: Apple)"
                  value={p.text2}
                  onChange={(e) => updatePair(idx, 'text2', e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => removePair(idx)}
                  className="p-1 text-slate-400 hover:text-rose-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Mô Tả & Hướng Dẫn Chơi</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Mô tả quy tắc chơi cho bé..."
            className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
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
            disabled={creating}
            className="flex-1 py-2 text-xs font-bold text-white bg-brand-600 rounded-xl hover:bg-brand-700 shadow-sm flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>{creating ? 'Đang khởi tạo...' : 'Tạo Trò Chơi'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
