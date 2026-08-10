import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { StarRating } from '../common/KidsBadge';
import { Trophy, HelpCircle, CheckCircle2, XCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export const QuizGame = ({ game, onFinish }) => {
  const { profile } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const questions = game?.config?.questions || [
    {
      id: 1,
      question: 'Trong phép tính "5 + 3 = ?", kết quả chính xác bằng bao nhiêu?',
      image: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=500&q=80',
      options: ['6', '7', '8', '9'],
      correctAnswer: 2, // Index of '8'
      explanation: '5 cộng 3 thêm bằng 8 đó bé ơi! 🎉'
    },
    {
      id: 2,
      question: 'Từ nào sau đây viết ĐÚNG chính tả tiếng Việt?',
      options: ['Kôn ngoan', 'Khôn ngoan', 'Khôn goan', 'Kôn goan'],
      correctAnswer: 1,
      explanation: '"Khôn ngoan" bắt đầu bằng âm Kh đó bé!'
    },
    {
      id: 3,
      question: 'Hình nào dưới đây mô tả loài động vật kêu "Gâu Gâu"? 🐶',
      options: ['Con Mèo', 'Con Chó', 'Con Lợn', 'Con Gà'],
      correctAnswer: 1,
      explanation: 'Chú Chó kêu Gâu Gâu rất trung thành!'
    }
  ];

  const currentQ = questions[currentIndex];

  const handleSelectOption = (idx) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    setShowExplanation(true);

    if (idx === currentQ.correctAnswer) {
      setScore((s) => s + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setShowExplanation(false);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      // Game Over
      handleVictory();
    }
  };

  const handleVictory = async () => {
    setIsCompleted(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    const total = questions.length;
    const finalScore = Math.round((score / total) * 100);

    let earnedStars = 3;
    if (finalScore < 50) earnedStars = 1;
    else if (finalScore < 80) earnedStars = 2;

    try {
      if (profile?.id) {
        const resultRecord = {
          game_id: game?.id || 'demo-game-quiz',
          student_id: profile.id,
          score: finalScore,
          max_score: 100,
          stars: earnedStars,
          completion_time_seconds: 45,
          played_at: new Date().toISOString()
        };

        if (isSupabaseConfigured && supabase) {
          await supabase.from('game_results').insert([resultRecord]);
        }
      }
    } catch (e) {
      console.error('Failed to save quiz result:', e);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      {!isCompleted ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-md space-y-6">
          {/* Progress header */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Câu hỏi {currentIndex + 1} / {questions.length}</span>
            <span className="text-brand-600 font-extrabold">Điểm: {score}</span>
          </div>

          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-brand-500 h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>

          {/* Question text & image */}
          <div className="space-y-4">
            <h3 className="text-xl font-extrabold text-slate-800 flex items-start gap-2">
              <HelpCircle className="w-6 h-6 text-brand-500 shrink-0 mt-0.5" />
              <span>{currentQ.question}</span>
            </h3>

            {currentQ.image && (
              <img
                src={currentQ.image}
                alt="Illustration"
                className="w-full h-48 object-cover rounded-2xl border border-slate-100"
              />
            )}
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((opt, idx) => {
              let btnStyle = 'bg-slate-50 border-slate-200 text-slate-700 hover:border-brand-300 hover:bg-brand-50';

              if (selectedOption !== null) {
                if (idx === currentQ.correctAnswer) {
                  btnStyle = 'bg-emerald-100 border-emerald-400 text-emerald-800 font-bold';
                } else if (idx === selectedOption) {
                  btnStyle = 'bg-rose-100 border-rose-400 text-rose-800 font-bold';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-4 rounded-2xl border-2 text-left font-bold text-sm transition-all flex items-center justify-between ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {selectedOption !== null && idx === currentQ.correctAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  )}
                  {selectedOption === idx && idx !== currentQ.correctAnswer && (
                    <XCircle className="w-5 h-5 text-rose-600" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation & Next */}
          {showExplanation && (
            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center justify-between gap-4 animate-pop">
              <p className="text-xs text-indigo-900 font-semibold">{currentQ.explanation}</p>
              <button
                onClick={handleNextQuestion}
                className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 shrink-0"
              >
                <span>Tiếp Theo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Victory Screen */
        <div className="bg-white p-8 rounded-3xl border-2 border-amber-200 shadow-xl text-center space-y-6 animate-pop">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-500 shadow-inner">
            <Trophy className="w-10 h-10 animate-bounce" />
          </div>

          <h3 className="text-2xl font-extrabold text-slate-800">HOÀN THÀNH TRẮC NGHIỆM!</h3>

          <div className="flex justify-center">
            <StarRating count={score === questions.length ? 3 : score > 0 ? 2 : 1} size="lg" />
          </div>

          <p className="text-lg font-bold text-brand-600">
            Bạn đúng {score} / {questions.length} câu hỏi!
          </p>

          <button
            onClick={() => {
              setCurrentIndex(0);
              setSelectedOption(null);
              setScore(0);
              setShowExplanation(false);
              setIsCompleted(false);
            }}
            className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-2xl shadow-lg inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Thử Thách Lại</span>
          </button>
        </div>
      )}
    </div>
  );
};
