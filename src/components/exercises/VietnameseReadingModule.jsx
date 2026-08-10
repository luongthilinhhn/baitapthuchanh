import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, BookOpen, Sparkles, Award, Star, CheckCircle, ArrowRight, Play } from 'lucide-react';

export const VietnameseReadingModule = ({ exercise, onComplete }) => {
  const [activeTab, setActiveTab] = useState('alphabet'); // 'alphabet' | 'spelling' | 'reading'
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [completedItems, setCompletedItems] = useState(new Set());

  // Bảng chữ cái Tiếng Việt dành cho bé 5-6 tuổi
  const alphabetList = [
    { letter: 'A', example: 'Quả Táo', image: '🍎' },
    { letter: 'Ă', example: 'Măng Tre', image: '🎋' },
    { letter: 'Â', example: 'Cây Nấm', image: '🍄' },
    { letter: 'B', example: 'Búp Bê', image: '🧸' },
    { letter: 'C', example: 'Con Cò', image: '🦩' },
    { letter: 'D', example: 'Quả Dưa', image: '🍉' },
    { letter: 'Đ', example: 'Đèn Pin', image: '🔦' },
    { letter: 'E', example: 'Em Bé', image: '👶' },
    { letter: 'Ê', example: 'Con Bế', image: '👑' },
    { letter: 'G', example: 'Con Gà', image: '🐓' },
    { letter: 'H', example: 'Bông Hoa', image: '🌸' },
    { letter: 'I', example: 'Viên Bi', image: '🔮' },
    { letter: 'K', example: 'Cái Kéo', image: '✂️' },
    { letter: 'L', example: 'Chiếc Lá', image: '🍃' },
    { letter: 'M', example: 'Con Mèo', image: '🐱' },
    { letter: 'N', example: 'Cái Nơ', image: '🎀' },
    { letter: 'O', example: 'Quả Ong', image: '🐝' },
    { letter: 'Ô', example: 'Cái Ô', image: '☂️' },
    { letter: 'Ơ', example: 'Cái Cờ', image: '🚩' },
    { letter: 'P', example: 'Xe Pin', image: '🚗' },
    { letter: 'Q', example: 'Quả Quýt', image: '🍊' },
    { letter: 'R', example: 'Con Rùa', image: '🐢' },
    { letter: 'S', example: 'Sóc Nâu', image: '🐿️' },
    { letter: 'T', example: 'Trái Tim', image: '❤️' },
    { letter: 'U', example: 'Dòng Suối', image: '🌊' },
    { letter: 'Ư', example: 'Hươu Sao', image: '🦌' },
    { letter: 'V', example: 'Con Voi', image: '🐘' },
    { letter: 'X', example: 'Xe Đạp', image: '🚲' },
    { letter: 'Y', example: 'Y Tế', image: '🏥' }
  ];

  // Bài học Ghép vần
  const spellingList = [
    { consonant: 'b', vowel: 'a', result: 'ba', meaning: 'Ba (Bố)', icon: '👨' },
    { consonant: 'c', vowel: 'a', result: 'ca', meaning: 'Cái Ca', icon: '🥛' },
    { consonant: 'm', vowel: 'a', result: 'ma', meaning: 'Bóng Ma', icon: '👻' },
    { consonant: 'g', vowel: 'à', result: 'gà', meaning: 'Con Gà', icon: '🐓' },
    { consonant: 'c', vowel: 'á', result: 'cá', meaning: 'Con Cá', icon: '🐟' },
    { consonant: 'm', vowel: 'ẹ', result: 'mẹ', meaning: 'Mẹ', icon: '👩' },
    { consonant: 'b', vowel: 'ò', result: 'bò', meaning: 'Con Bò', icon: '🐄' },
    { consonant: 'c', vowel: 'ổ', result: 'cổ', meaning: 'Cái Cổ', icon: '🦒' }
  ];

  // Từ & Câu ngắn luyện đọc
  const readingList = [
    { text: 'Con gà trống', image: '🐓', note: 'Con gà trống gáy o ó o' },
    { text: 'Mẹ yêu bé', image: '👩‍👧', note: 'Bé ngoan được mẹ yêu' },
    { text: 'Bé đi học', image: '🎒', note: 'Bé đi học mẫu giáo vui lắm' },
    { text: 'Bông hoa đỏ', image: '🌹', note: 'Bông hoa hồng nở rất đẹp' },
    { text: 'Chú mèo con', image: '🐱', note: 'Chú mèo con keo meo meo' }
  ];

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleItemClick = (id, textToSpeak) => {
    speakText(textToSpeak);
    setCompletedItems((prev) => {
      const next = new Set(prev);
      next.add(id);

      if (next.size % 5 === 0) {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.7 }
        });
      }
      return next;
    });
  };

  return (
    <div className="bg-gradient-to-b from-rose-50 to-amber-50 rounded-3xl p-6 sm:p-8 border-4 border-rose-200 shadow-lg max-w-4xl mx-auto my-4">
      {/* Module Title */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 text-center sm:text-left">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500 text-white font-black text-xs rounded-full uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Tiếng Việt Luyện Đọc 5-6 Tuổi</span>
          </div>
          <h2 className="text-2xl font-black text-slate-800">BẢNG CHỮ CÁI & GHÉP VẦN THÔNG MINH</h2>
        </div>

        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-rose-200 shadow-sm">
          <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          <span className="text-sm font-extrabold text-slate-700">
            Đã đọc: <span className="text-rose-600">{completedItems.size}</span> thẻ
          </span>
        </div>
      </div>

      {/* Tabs Selection */}
      <div className="flex rounded-2xl bg-white p-1.5 border border-rose-200 mb-6 shadow-inner gap-1">
        <button
          onClick={() => setActiveTab('alphabet')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
            activeTab === 'alphabet'
              ? 'bg-rose-500 text-white shadow-md'
              : 'text-slate-600 hover:bg-rose-50'
          }`}
        >
          <span>1. Bảng Chữ Cái</span>
        </button>
        <button
          onClick={() => setActiveTab('spelling')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
            activeTab === 'spelling'
              ? 'bg-amber-500 text-white shadow-md'
              : 'text-slate-600 hover:bg-amber-50'
          }`}
        >
          <span>2. Tập Ghép Vần</span>
        </button>
        <button
          onClick={() => setActiveTab('reading')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
            activeTab === 'reading'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-indigo-50'
          }`}
        >
          <span>3. Đọc Từ & Câu</span>
        </button>
      </div>

      {/* TAB 1: BẢNG CHỮ CÁI */}
      {activeTab === 'alphabet' && (
        <div>
          <p className="text-xs text-slate-500 text-center mb-4">
            Bé bấm vào từng ô chữ cái để nghe cô phát âm chuẩn và xem hình minh họa nhé!
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {alphabetList.map((item) => {
              const itemId = `alpha_${item.letter}`;
              const isDone = completedItems.has(itemId);

              return (
                <button
                  key={item.letter}
                  onClick={() => handleItemClick(itemId, `Chữ ${item.letter}. ${item.example}`)}
                  className={`relative bg-white rounded-2xl p-4 border-2 transition-all transform hover:-translate-y-1 hover:shadow-lg active:scale-95 flex flex-col items-center justify-center group ${
                    isDone ? 'border-emerald-400 bg-emerald-50/50' : 'border-rose-100 hover:border-rose-400'
                  }`}
                >
                  {isDone && (
                    <CheckCircle className="w-4 h-4 text-emerald-500 absolute top-2 right-2" />
                  )}
                  <span className="text-4xl font-black text-rose-600 group-hover:scale-110 transition-transform">
                    {item.letter}
                  </span>
                  <span className="text-2xl mt-1">{item.image}</span>
                  <span className="text-[11px] font-bold text-slate-600 mt-1 line-clamp-1">
                    {item.example}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: GHÉP VẦN */}
      {activeTab === 'spelling' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-500 text-center mb-4">
            Bé bấm nút phát âm để tập đánh vần: <span className="font-bold text-amber-600">Âm đầu + Vần = Từ</span>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {spellingList.map((sp, idx) => {
              const itemId = `spelling_${idx}`;
              const isDone = completedItems.has(itemId);

              return (
                <div
                  key={idx}
                  className={`bg-white rounded-3xl p-5 border-2 shadow-sm flex items-center justify-between gap-4 transition-all ${
                    isDone ? 'border-amber-400 bg-amber-50/40' : 'border-amber-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 bg-amber-100 rounded-2xl">{sp.icon}</span>
                    <div>
                      <div className="flex items-center gap-2 text-xl font-black text-slate-800">
                        <span className="px-2.5 py-1 bg-sky-100 text-sky-700 rounded-xl">{sp.consonant}</span>
                        <span className="text-slate-400">+</span>
                        <span className="px-2.5 py-1 bg-rose-100 text-rose-700 rounded-xl">{sp.vowel}</span>
                        <span className="text-slate-400">=</span>
                        <span className="px-3 py-1 bg-amber-400 text-slate-900 rounded-xl text-2xl">
                          {sp.result}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-500 mt-1">{sp.meaning}</p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      handleItemClick(
                        itemId,
                        `${sp.consonant} ${sp.vowel} ${sp.result}. ${sp.meaning}`
                      )
                    }
                    className="p-3 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl shadow-md transition-all flex items-center justify-center shrink-0"
                    title="Nghe đánh vần"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: ĐỌC TỪ & CÂU */}
      {activeTab === 'reading' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-500 text-center mb-4">
            Bé xem hình và bấm nút để cô đọc từ & câu cho nghe nhé!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {readingList.map((rd, idx) => {
              const itemId = `reading_${idx}`;
              const isDone = completedItems.has(itemId);

              return (
                <div
                  key={idx}
                  className={`bg-white rounded-3xl p-6 border-2 shadow-sm flex items-center gap-4 transition-all ${
                    isDone ? 'border-indigo-400 bg-indigo-50/40' : 'border-indigo-100'
                  }`}
                >
                  <span className="text-5xl p-3 bg-indigo-50 rounded-3xl shrink-0">{rd.image}</span>
                  <div className="flex-1">
                    <h4 className="text-xl font-black text-indigo-900">{rd.text}</h4>
                    <p className="text-xs text-slate-500 mt-1 italic">"{rd.note}"</p>

                    <button
                      onClick={() => handleItemClick(itemId, `${rd.text}. ${rd.note}`)}
                      className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-xl shadow-md flex items-center gap-1.5 transition-all"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>Đọc cho bé nghe</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Completion reward */}
      <div className="mt-8 text-center pt-6 border-t border-rose-200">
        <button
          onClick={() => {
            confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
            speakText('Bé học xuất sắc lắm! Thưởng cho bé 3 ngôi sao sáng!');
            if (onComplete) onComplete({ score: 100, stars: 3 });
          }}
          className="px-8 py-3.5 bg-gradient-to-r from-amber-400 to-rose-400 hover:from-amber-500 hover:to-rose-500 text-slate-900 font-black text-sm rounded-2xl shadow-lg transition-transform transform active:scale-95 inline-flex items-center gap-2"
        >
          <Award className="w-5 h-5" />
          <span>BÉ HOÀN THÀNH BÀI ĐỌC HÔM NAY ⭐</span>
        </button>
      </div>
    </div>
  );
};
