import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, Sparkles, CheckCircle2, RotateCcw, ArrowRight, Award, HelpCircle } from 'lucide-react';

export const MathExerciseModule = ({ exercise, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Default preset questions if custom config is missing
  const questions = exercise?.config?.questions || [
    // 1. Tách gộp số
    {
      type: 'math_split_merge',
      question: 'Số 5 được tách thành 2 và mấy?',
      total: 5,
      known: 2,
      target: 3,
      icon: '🍎',
      options: [1, 2, 3, 4]
    },
    {
      type: 'math_split_merge',
      question: 'Gộp 3 quả dâu và 2 quả dâu được mấy quả?',
      partA: 3,
      partB: 2,
      target: 5,
      icon: '🍓',
      options: [4, 5, 6, 7]
    },
    // 2. Điền số còn thiếu
    {
      type: 'math_fill_number',
      question: 'Bé hãy điền số còn thiếu vào ô trống:',
      sequence: [1, 2, '?', 4, 5],
      target: 3,
      options: [2, 3, 4, 5]
    },
    {
      type: 'math_fill_number',
      question: 'Tìm số thích hợp điền vào ô trống:',
      sequence: [6, 7, 8, '?', 10],
      target: 9,
      options: [7, 8, 9, 10]
    },
    // 3. Tìm số & Đếm số
    {
      type: 'math_find_number',
      question: 'Có bao nhiêu chú gấu vàng ở dưới đây?',
      count: 4,
      icon: '🧸',
      target: 4,
      options: [3, 4, 5, 6]
    },
    // 4. Tìm quy luật
    {
      type: 'math_pattern',
      question: 'Bé hãy tìm hình tiếp theo đúng quy luật nhé:',
      pattern: ['🔴', '🔵', '🔴', '🔵', '?'],
      target: '🔴',
      options: ['🔴', '🔵', '🟡', '🟢']
    }
  ];

  const currentQ = questions[currentStep];

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSelectOption = (opt) => {
    if (isCorrect !== null) return;
    setSelectedAnswer(opt);
    const correct = opt === currentQ.target;
    setIsCorrect(correct);

    if (correct) {
      setScore((prev) => prev + 1);
      speakText('Bé giỏi quá! Đúng rồi!');
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } else {
      speakText('Bé thử lại câu khác xem sao nhé!');
    }
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      setIsFinished(true);
      speakText(`Chúc mừng bé đã hoàn thành bài tập với ${score + (isCorrect ? 1 : 0)} câu đúng!`);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
      if (onComplete) {
        onComplete({
          score: Math.round(((score + (isCorrect ? 1 : 0)) / questions.length) * 100),
          totalQuestions: questions.length,
          correctCount: score + (isCorrect ? 1 : 0)
        });
      }
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setScore(0);
    setIsFinished(false);
  };

  if (isFinished) {
    const finalScore = score;
    const total = questions.length;
    const stars = finalScore === total ? 3 : finalScore >= Math.floor(total / 2) ? 2 : 1;

    return (
      <div className="bg-white rounded-3xl p-8 border-4 border-amber-300 shadow-xl text-center max-w-xl mx-auto my-6 animate-fade-in">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-amber-400">
          <Award className="w-12 h-12 text-amber-500" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-800">BÉ ĐÃ HOÀN THÀNH BÀI TẬP TOÁN!</h2>
        <p className="text-sm text-slate-600 mt-2">
          Bé đã trả lời đúng <span className="text-brand-600 font-bold">{finalScore}/{total}</span> câu hỏi.
        </p>

        <div className="flex justify-center gap-2 my-6">
          {[1, 2, 3].map((star) => (
            <span
              key={star}
              className={`text-4xl transition-transform ${
                star <= stars ? 'scale-110 text-amber-400 drop-shadow-md' : 'text-slate-200'
              }`}
            >
              ⭐
            </span>
          ))}
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={handleRestart}
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-sm rounded-2xl flex items-center gap-2 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Làm lại bài
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-sky-50 to-indigo-50 rounded-3xl p-6 sm:p-8 border-4 border-sky-200 shadow-lg max-w-2xl mx-auto my-4">
      {/* Header Info */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-amber-400 text-slate-900 font-black text-xs rounded-full uppercase tracking-wider">
            Toán Tiền Tiểu Học
          </span>
          <span className="text-xs font-bold text-slate-500">
            Câu {currentStep + 1} / {questions.length}
          </span>
        </div>
        <button
          onClick={() => speakText(currentQ.question)}
          className="p-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl shadow-md transition-all flex items-center gap-1.5 text-xs font-bold"
          title="Đọc câu hỏi cho bé nghe"
        >
          <Volume2 className="w-4 h-4" />
          <span>Đọc câu hỏi</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 rounded-full h-3 mb-6 overflow-hidden">
        <div
          className="bg-brand-500 h-3 rounded-full transition-all duration-300"
          style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      {/* Question Title */}
      <h3 className="text-xl font-black text-slate-800 text-center mb-6 leading-relaxed">
        {currentQ.question}
      </h3>

      {/* Visual Illustrative Area depending on question type */}
      <div className="bg-white rounded-3xl p-6 border-2 border-sky-100 shadow-inner mb-8 flex flex-col items-center justify-center min-h-[160px]">
        {/* Type 1: Split & Merge */}
        {currentQ.type === 'math_split_merge' && (
          <div className="space-y-4 text-center">
            {currentQ.total && (
              <div>
                <p className="text-xs font-bold text-slate-400 mb-2">Tổng số:</p>
                <div className="flex flex-wrap justify-center gap-2 text-3xl">
                  {Array.from({ length: currentQ.total }).map((_, i) => (
                    <span key={i} className="animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
                      {currentQ.icon}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {currentQ.partA !== undefined && (
              <div className="flex items-center justify-center gap-4 text-2xl font-black text-slate-700">
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
                  {Array.from({ length: currentQ.partA }).map((_, i) => (
                    <span key={i}>{currentQ.icon}</span>
                  ))}
                  <div className="text-sm text-amber-600 mt-1">{currentQ.partA}</div>
                </div>
                <span className="text-3xl text-brand-500">+</span>
                <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200">
                  {Array.from({ length: currentQ.partB }).map((_, i) => (
                    <span key={i}>{currentQ.icon}</span>
                  ))}
                  <div className="text-sm text-indigo-600 mt-1">{currentQ.partB}</div>
                </div>
                <span className="text-3xl text-brand-500">=</span>
                <div className="w-14 h-14 bg-amber-100 rounded-2xl border-2 border-dashed border-amber-400 flex items-center justify-center text-amber-700 font-extrabold">
                  ?
                </div>
              </div>
            )}
          </div>
        )}

        {/* Type 2: Fill in missing number */}
        {currentQ.type === 'math_fill_number' && (
          <div className="flex items-center justify-center gap-3">
            {currentQ.sequence.map((item, idx) => (
              <div
                key={idx}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black shadow-sm transition-all ${
                  item === '?'
                    ? 'bg-amber-100 border-4 border-dashed border-amber-400 text-amber-600 animate-pulse'
                    : 'bg-indigo-50 border-2 border-indigo-200 text-indigo-700'
                }`}
              >
                {item === '?' && selectedAnswer !== null ? selectedAnswer : item}
              </div>
            ))}
          </div>
        )}

        {/* Type 3: Find & Count */}
        {currentQ.type === 'math_find_number' && (
          <div className="flex flex-wrap justify-center gap-3 text-4xl py-2 max-w-sm">
            {Array.from({ length: currentQ.count }).map((_, i) => (
              <span key={i} className="hover:scale-125 transition-transform cursor-pointer">
                {currentQ.icon}
              </span>
            ))}
          </div>
        )}

        {/* Type 4: Pattern Recognition */}
        {currentQ.type === 'math_pattern' && (
          <div className="flex items-center justify-center gap-3 text-4xl">
            {currentQ.pattern.map((item, idx) => (
              <div
                key={idx}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${
                  item === '?'
                    ? 'bg-amber-100 border-4 border-dashed border-amber-400 text-2xl font-black text-amber-600'
                    : 'bg-slate-50 border border-slate-200'
                }`}
              >
                {item === '?' && selectedAnswer !== null ? selectedAnswer : item}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Answer Options */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {currentQ.options.map((opt, idx) => {
          let btnStyle = 'bg-white border-2 border-slate-200 text-slate-800 hover:border-sky-400 hover:bg-sky-50';

          if (selectedAnswer === opt) {
            if (isCorrect) {
              btnStyle = 'bg-emerald-500 border-2 border-emerald-600 text-white shadow-emerald-500/30';
            } else {
              btnStyle = 'bg-rose-500 border-2 border-rose-600 text-white shadow-rose-500/30';
            }
          }

          return (
            <button
              key={idx}
              disabled={isCorrect !== null}
              onClick={() => handleSelectOption(opt)}
              className={`py-4 rounded-2xl text-2xl font-black shadow-md transition-all transform active:scale-95 flex items-center justify-center ${btnStyle}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* Action Footer */}
      {isCorrect !== null && (
        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border-2 border-sky-100 animate-fade-in">
          <div className="flex items-center gap-2">
            {isCorrect ? (
              <div className="flex items-center gap-2 text-emerald-600 font-extrabold text-sm">
                <CheckCircle2 className="w-6 h-6 fill-emerald-100" />
                <span>Chính xác rồi! Tuyệt vời quá bé ơi! 🎉</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-rose-600 font-extrabold text-sm">
                <HelpCircle className="w-6 h-6" />
                <span>Chưa đúng rồi! Đáp án đúng là {currentQ.target} nhé!</span>
              </div>
            )}
          </div>

          <button
            onClick={handleNext}
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all"
          >
            <span>{currentStep < questions.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
