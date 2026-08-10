import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Award, RotateCcw, CheckCircle2, ArrowRight, HelpCircle, Lightbulb } from 'lucide-react';

export const LogicMindGame = ({ onComplete }) => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Danh sách các màn chơi tư duy logic cho trẻ 5-6 tuổi
  const levels = [
    {
      type: 'odd_one_out',
      title: 'Trò chơi: Tìm hình khác nhóm!',
      instruction: 'Bé hãy tìm hình nào không cùng nhóm với các hình còn lại nhé:',
      items: [
        { icon: '🐶', category: 'animal', label: 'Chú chó' },
        { icon: '🐱', category: 'animal', label: 'Chú mèo' },
        { icon: '🍎', category: 'fruit', label: 'Quả táo' }, // Odd one out!
        { icon: '🐰', category: 'animal', label: 'Chú thỏ' }
      ],
      correctIndex: 2,
      explanation: 'Quả táo là trái cây, còn 3 hình kia đều là con vật!'
    },
    {
      type: 'odd_one_out',
      title: 'Trò chơi: Tìm hình khác nhóm!',
      instruction: 'Bé tìm món nào không phải là đồ dùng học tập?',
      items: [
        { icon: '✏️', category: 'school', label: 'Bút chibi' },
        { icon: '📖', category: 'school', label: 'Quyển sách' },
        { icon: '🎒', category: 'school', label: 'Cặp sách' },
        { icon: '🍦', category: 'food', label: 'Cây kem' } // Odd one out!
      ],
      correctIndex: 3,
      explanation: 'Cây kem là món ăn, còn các món còn lại là đồ dùng học tập!'
    },
    {
      type: 'size_sorting',
      title: 'Trò chơi: Nhận biết kích thước!',
      instruction: 'Bé hãy chọn hình có kích thước TỚN NHẤT (To nhất)!',
      items: [
        { icon: '🎈', size: 'text-2xl', label: 'Bóng nhỏ' },
        { icon: '🎈', size: 'text-4xl', label: 'Bóng vừa' },
        { icon: '🎈', size: 'text-6xl', label: 'Bóng TO NHẤT' }, // Correct!
        { icon: '🎈', size: 'text-3xl', label: 'Bóng nhỏ vừa' }
      ],
      correctIndex: 2,
      explanation: 'Đúng rồi! Quả bóng này là to nhất đấy!'
    },
    {
      type: 'odd_one_out',
      title: 'Trò chơi: Phân biệt phương tiện giao thông!',
      instruction: 'Bé hãy tìm hình nào KHÔNG chạy trên đường bộ?',
      items: [
        { icon: '🚗', category: 'road', label: 'Ô tô' },
        { icon: '✈️', category: 'sky', label: 'Máy bay' }, // Odd one out!
        { icon: '🚌', category: 'road', label: 'Xe buýt' },
        { icon: '🛵', category: 'road', label: 'Xe máy' }
      ],
      correctIndex: 1,
      explanation: 'Máy bay bay trên bầu trời, còn ô tô, xe buýt, xe máy chạy trên đường bộ!'
    }
  ];

  const levelData = levels[currentLevel];

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSelect = (idx) => {
    if (isCorrect !== null) return;
    setSelectedIdx(idx);
    const correct = idx === levelData.correctIndex;
    setIsCorrect(correct);

    if (correct) {
      setScore((prev) => prev + 1);
      speakText('Bé thông minh quá! Chính xác rồi!');
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } else {
      speakText('Chưa chính xác rồi. Bé suy nghĩ lại xem nhé!');
    }
  };

  const handleNext = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel((prev) => prev + 1);
      setSelectedIdx(null);
      setIsCorrect(null);
    } else {
      setIsFinished(true);
      speakText('Chúc mừng bé đã hoàn thành các câu hỏi tư duy logic!');
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      if (onComplete) {
        onComplete({
          score: Math.round(((score + (isCorrect ? 1 : 0)) / levels.length) * 100),
          stars: 3
        });
      }
    }
  };

  if (isFinished) {
    return (
      <div className="bg-white rounded-3xl p-8 border-4 border-indigo-300 shadow-xl text-center max-w-xl mx-auto my-6">
        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-indigo-400">
          <Lightbulb className="w-12 h-12 text-indigo-600 animate-pulse" />
        </div>
        <h2 className="text-2xl font-black text-slate-800">BÉ LÀ THIÊN TÀI TƯ DUY! 🧠</h2>
        <p className="text-sm text-slate-600 mt-2">
          Bé đã xuất sắc vượt qua bài tập phát triển tư duy logic với{' '}
          <span className="text-indigo-600 font-bold">{score}/{levels.length}</span> câu đúng!
        </p>

        <div className="flex justify-center gap-2 my-6">
          {[1, 2, 3].map((star) => (
            <span key={star} className="text-4xl text-amber-400 animate-bounce" style={{ animationDelay: `${star * 0.2}s` }}>
              ⭐
            </span>
          ))}
        </div>

        <button
          onClick={() => {
            setCurrentLevel(0);
            setSelectedIdx(null);
            setIsCorrect(null);
            setScore(0);
            setIsFinished(false);
          }}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-2xl shadow-md inline-flex items-center gap-2 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Chơi lại từ đầu</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-indigo-50 to-purple-50 rounded-3xl p-6 sm:p-8 border-4 border-indigo-200 shadow-lg max-w-2xl mx-auto my-4">
      {/* Level Header */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-indigo-600 text-white font-black text-xs rounded-full uppercase tracking-wider">
            Phát Triển Tư Duy 5-6 Tuổi
          </span>
          <span className="text-xs font-bold text-slate-500">
            Màn {currentLevel + 1} / {levels.length}
          </span>
        </div>

        <button
          onClick={() => speakText(levelData.instruction)}
          className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1"
        >
          <Lightbulb className="w-4 h-4" />
          <span>Đọc hướng dẫn</span>
        </button>
      </div>

      {/* Progress */}
      <div className="w-full bg-slate-200 rounded-full h-3 mb-6 overflow-hidden">
        <div
          className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
          style={{ width: `${((currentLevel + 1) / levels.length) * 100}%` }}
        ></div>
      </div>

      <h3 className="text-xl font-black text-indigo-950 text-center mb-2">{levelData.title}</h3>
      <p className="text-sm font-bold text-slate-700 text-center mb-8 bg-white/80 p-3 rounded-2xl border border-indigo-100 shadow-sm">
        {levelData.instruction}
      </p>

      {/* Item Choice Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {levelData.items.map((item, idx) => {
          let cardStyle = 'bg-white border-2 border-indigo-100 hover:border-indigo-400 hover:shadow-md';

          if (selectedIdx === idx) {
            if (isCorrect) {
              cardStyle = 'bg-emerald-500 border-2 border-emerald-600 text-white shadow-lg shadow-emerald-500/20';
            } else {
              cardStyle = 'bg-rose-500 border-2 border-rose-600 text-white shadow-lg shadow-rose-500/20';
            }
          }

          return (
            <button
              key={idx}
              disabled={isCorrect !== null}
              onClick={() => handleSelect(idx)}
              className={`p-6 rounded-3xl flex flex-col items-center justify-center transition-all transform active:scale-95 group ${cardStyle}`}
            >
              <span className={`${item.size || 'text-6xl'} group-hover:scale-110 transition-transform mb-2`}>
                {item.icon}
              </span>
              <span className="text-xs font-extrabold">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Result feedback */}
      {isCorrect !== null && (
        <div className="bg-white p-5 rounded-2xl border-2 border-indigo-100 shadow-md flex items-center justify-between gap-4 animate-fade-in">
          <div>
            {isCorrect ? (
              <p className="text-xs font-extrabold text-emerald-600">
                🎉 Bé chọn chính xác rồi! {levelData.explanation}
              </p>
            ) : (
              <p className="text-xs font-extrabold text-rose-600">
                😅 Rất tiếc! {levelData.explanation}
              </p>
            )}
          </div>

          <button
            onClick={handleNext}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5 shrink-0 transition-all"
          >
            <span>{currentLevel < levels.length - 1 ? 'Màn tiếp theo' : 'Xem phần thưởng'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
