import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { JoinClassModal } from '../../components/classes/JoinClassModal';
import { StarRating } from '../../components/common/KidsBadge';
import { Gamepad2, BookOpen, Key, Trophy, Sparkles, Calculator, Award, Play, Brain } from 'lucide-react';

export const StudentDashboard = () => {
  const { profile } = useAuth();
  const [showJoinModal, setShowJoinModal] = useState(false);

  const featuredExercises = [
    {
      id: 'ex_math_01',
      title: '🧮 Bài Tập Toán: Tách Gộp Số & Quy Luật',
      type: 'toan',
      description: 'Hình ảnh hạt/táo minh họa sinh động giúp bé học tách gộp số 1-10.',
      icon: Calculator,
      color: 'sky'
    },
    {
      id: 'ex_vietnamese_01',
      title: '📖 Tiếng Việt: Chữ Cái & Tập Ghép Vần',
      type: 'tieng_viet',
      description: 'Phát âm chuẩn bằng giọng đọc mẫu, xem hình từ vựng minh họa.',
      icon: BookOpen,
      color: 'rose'
    }
  ];

  const featuredGames = [
    {
      id: 'demo-game-logic',
      title: '🧠 Trò Chơi Phát Triển Tư Duy 5-6 Tuổi',
      type: 'logic_mind',
      subject: 'Tư duy logic',
      starsEarned: 3
    },
    {
      id: 'demo-game-matching',
      title: '🎮 Lật Hình Tìm Cặp Từ Vựng & Chữ Cái',
      type: 'matching',
      subject: 'Tiếng Việt',
      starsEarned: 3
    },
    {
      id: 'demo-game-math',
      title: '⚡ Thử Thách Phản Xạ Đếm Quá Siêu Tốc',
      type: 'math_speed',
      subject: 'Toán học',
      starsEarned: 2
    }
  ];

  return (
    <div className="space-y-6">
      {/* Joyful Kid Welcome Banner */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 text-slate-900 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm text-xs font-black text-amber-900">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Góc Học Tập Trẻ Tiền Tiểu Học 5-6 Tuổi 🌟</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Chào mừng bé {profile?.full_name || 'Học sinh'}! 🎉
          </h1>
          <p className="text-xs font-black text-slate-800/90">
            Bé đã tích lũy được <strong className="text-rose-700 text-sm">9 Sao Vàng ⭐</strong> trong tuần này!
          </p>
        </div>

        <button
          onClick={() => setShowJoinModal(true)}
          className="relative z-10 px-5 py-3 bg-white hover:bg-slate-50 text-slate-900 font-black text-xs rounded-2xl shadow-lg flex items-center gap-2 border-2 border-amber-300 transform hover:scale-105 transition-all"
        >
          <Key className="w-5 h-5 text-amber-500" />
          <span>Vào Lớp Bằng Mã Lớp</span>
        </button>
      </div>

      {/* Star Rewards Trophy Box */}
      <div className="bg-white p-6 rounded-3xl border-2 border-amber-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-500 shadow-inner">
            <Trophy className="w-8 h-8 animate-bounce" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-800">Bảng Vàng Hái Sao Của Bé</h3>
            <p className="text-xs text-slate-500">Bé chăm chỉ hoàn thành bài tập & chơi game nhé!</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StarRating count={3} size="lg" />
          <span className="text-xl font-black text-amber-600">9 / 10 Sao</span>
        </div>
      </div>

      {/* Recommended Pre-Primary Exercises */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <Calculator className="w-6 h-6 text-sky-500" />
            Bài Tập Tiền Tiểu Học (5-6 Tuổi)
          </h3>
          <Link to="/exercises" className="text-xs font-black text-sky-600 hover:underline">
            Xem tất cả bài tập ➔
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featuredExercises.map((ex) => {
            const IconComponent = ex.icon;
            return (
              <div
                key={ex.id}
                className="bg-white rounded-3xl border-2 border-slate-100 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-sky-50 text-sky-600 rounded-2xl">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 text-[11px] font-black rounded-full">
                      5-6 tuổi
                    </span>
                  </div>
                  <h4 className="text-base font-black text-slate-800">{ex.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{ex.description}</p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100">
                  <Link
                    to="/exercises"
                    className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>LÀM BÀI NGAY BÉ ƠI ⭐</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Educational Games Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-purple-500" />
            Trò Chơi Giáo Dục & Tư Duy
          </h3>
          <Link to="/games" className="text-xs font-black text-purple-600 hover:underline">
            Vào kho trò chơi 🎮
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {featuredGames.map((game) => (
            <div
              key={game.id}
              className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded-md border border-purple-100">
                    {game.subject}
                  </span>
                  <StarRating count={game.starsEarned} size="sm" />
                </div>
                <h4 className="text-base font-black text-slate-800 group-hover:text-brand-600 transition-colors">
                  {game.title}
                </h4>
              </div>

              <div className="mt-6">
                <Link
                  to={`/games/${game.id}`}
                  className="w-full py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>CHƠI NGAY THÔI</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Join Class Modal */}
      <JoinClassModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onJoin={(code) => alert(`Đã gửi yêu cầu gia nhập lớp với mã ${code}`)}
      />
    </div>
  );
};
