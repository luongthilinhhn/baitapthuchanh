import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { MathExerciseModule } from '../../components/exercises/MathExerciseModule';
import { VietnameseReadingModule } from '../../components/exercises/VietnameseReadingModule';
import { BookOpen, Calculator, Sparkles, Award, Star, ArrowLeft } from 'lucide-react';

export const ExerciseHub = () => {
  const { profile } = useAuth();
  const [activeCategory, setActiveCategory] = useState('toan'); // 'toan' | 'tieng_viet'
  const [activeExercise, setActiveExercise] = useState(null);
  const [completedList, setCompletedList] = useState([]);

  // Mock / Preset Exercises list when DB is empty
  const exercises = [
    {
      id: 'ex_math_01',
      title: '🧮 Bài Tập Toán: Tách Gộp Số & Điền Số Còn Thiếu',
      category: 'toan',
      exercise_type: 'math_split_merge',
      description: 'Luyện tập đếm hình, tách gộp số từ 1 đến 10 và tìm quy luật số.',
      grade_level: '5-6 tuổi'
    },
    {
      id: 'ex_vietnamese_01',
      title: '📖 Tiếng Việt Luyện Đọc: Chữ Cái & Tập Ghép Vần',
      category: 'tieng_viet',
      exercise_type: 'vietnamese_phonics',
      description: 'Học bảng chữ cái Tiếng Việt, nghe phát âm chuẩn và tập ghép âm đơn giản.',
      grade_level: '5-6 tuổi'
    }
  ];

  const filtered = exercises.filter((ex) => ex.category === activeCategory);

  const handleExerciseCompleted = async (result) => {
    if (activeExercise?.id) {
      setCompletedList((prev) => [...prev, activeExercise.id]);
    }
    if (isSupabaseConfigured && supabase && profile?.id && activeExercise?.id && !activeExercise.id.startsWith('ex_')) {
      try {
        await supabase.from('exercise_submissions').insert([
          {
            exercise_id: activeExercise.id,
            student_id: profile.id,
            score: result?.score || 100,
            max_score: 100,
            stars: result?.stars || (result?.score >= 80 ? 3 : result?.score >= 50 ? 2 : 1),
            answers: result || {},
            completed_at: new Date().toISOString()
          }
        ]);
      } catch (err) {
        console.error('Failed to record exercise submission:', err);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Active Exercise Player View */}
      {activeExercise ? (
        <div className="space-y-4">
          <button
            onClick={() => setActiveExercise(null)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại Danh sách bài tập
          </button>

          {activeExercise.category === 'toan' ? (
            <MathExerciseModule
              exercise={activeExercise}
              onComplete={handleExerciseCompleted}
            />
          ) : (
            <VietnameseReadingModule
              exercise={activeExercise}
              onComplete={handleExerciseCompleted}
            />
          )}
        </div>
      ) : (
        /* Hub Overview List View */
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                <Sparkles className="w-7 h-7 text-amber-500" />
                Góc Bài Tập Rèn Luyện 5-6 Tuổi
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Các dạng bài tập Toán (tách gộp, điền số, quy luật) và Tiếng Việt (luyện đọc, ghép vần) trực quan cho trẻ tiền tiểu học.
              </p>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-3 border-b border-slate-200 pb-3">
            <button
              onClick={() => setActiveCategory('toan')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
                activeCategory === 'toan'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'bg-white text-slate-600 hover:bg-sky-50 border border-slate-200'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>Bài Tập Toán Học</span>
            </button>

            <button
              onClick={() => setActiveCategory('tieng_viet')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
                activeCategory === 'tieng_viet'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                  : 'bg-white text-slate-600 hover:bg-rose-50 border border-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Tiếng Việt Luyện Đọc</span>
            </button>
          </div>

          {/* Exercise Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((ex) => {
              const isDone = completedList.includes(ex.id);

              return (
                <div
                  key={ex.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-3 py-1 bg-amber-100 text-amber-800 text-[11px] font-black rounded-full">
                        {ex.grade_level}
                      </span>
                      {isDone && (
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          <Award className="w-3.5 h-3.5" /> Đã hoàn thành
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-black text-slate-800 group-hover:text-brand-600 transition-colors">
                      {ex.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      {ex.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => setActiveExercise(ex)}
                      className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{isDone ? 'LÀM LẠI BÀI TẬP' : 'LÀM BÀI TẬP NGAY ⭐'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
