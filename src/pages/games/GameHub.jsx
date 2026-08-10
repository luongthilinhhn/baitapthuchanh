import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { GameCreatorModal } from '../../components/games/GameCreatorModal';
import { SubjectBadge, GradeBadge } from '../../components/common/KidsBadge';
import { Gamepad2, Plus, Play, Sparkles, Trophy, Zap, HelpCircle, Brain } from 'lucide-react';

export const GameHub = () => {
  const { profile, isTeacher } = useAuth();
  const [showGameModal, setShowGameModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState([]);

  const fetchGames = async () => {
    setLoading(true);
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('games')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          setGames(data);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error('Error fetching games:', err);
      }
    }

    setGames([
      {
        id: 'demo-game-logic',
        title: '🧠 Trò Chơi Phát Triển Tư Duy 5-6 Tuổi',
        description: 'Tìm hình khác nhóm, phân biệt kích thước & phương tiện giao thông.',
        game_type: 'logic_mind',
        subject: 'Phát triển tư duy',
        grade_level: '5-6 tuổi'
      },
      {
        id: 'demo-game-matching',
        title: '🎮 Lật Hình Tìm Cặp Từ Vựng & Hình Ảnh',
        description: 'Lật các thẻ bài để tìm chữ cái và hình ảnh minh họa tương ứng.',
        game_type: 'matching',
        subject: 'Tiếng Việt',
        grade_level: '5-6 tuổi'
      },
      {
        id: 'demo-game-math',
        title: '⚡ Thử Thách Phản Xạ Đếm Quá Siêu Tốc',
        description: 'Đếm quả & giải bài tập tách gộp số trong 30 giây để đạt 3 sao!',
        game_type: 'math_speed',
        subject: 'Toán học',
        grade_level: '5-6 tuổi'
      },
      {
        id: 'demo-game-quiz',
        title: '🧩 Trắc Nghiệm Trực Quan Toán & Tiếng Việt',
        description: 'Trả lời các câu hỏi trắc nghiệm rực rỡ sắc màu có minh họa.',
        game_type: 'quiz',
        subject: 'Tổng hợp',
        grade_level: '5-6 tuổi'
      }
    ]);
    setLoading(false);
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleGameCreated = async () => {
    await fetchGames();
  };

  const getGameTypeIcon = (type) => {
    switch (type) {
      case 'logic_mind':
        return <Brain className="w-6 h-6 text-indigo-600" />;
      case 'matching':
        return <Gamepad2 className="w-6 h-6 text-amber-500" />;
      case 'quiz':
        return <HelpCircle className="w-6 h-6 text-sky-500" />;
      case 'math_speed':
      default:
        return <Zap className="w-6 h-6 text-purple-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Gamepad2 className="w-7 h-7 text-purple-600" />
            Trò Chơi Giáo Dục & Tư Duy 5-6 Tuổi
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Bộ sưu tập trò chơi củng cố kiến thức Toán, Tiếng Việt và phát triển tư duy sáng tạo cho trẻ tiền tiểu học.
          </p>
        </div>

        {isTeacher && (
          <button
            onClick={() => setShowGameModal(true)}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo Trò Chơi Mới</span>
          </button>
        )}
      </div>

      {/* Grid Games */}
      {loading ? (
        <div className="py-12 text-center text-xs font-semibold text-slate-400">
          Đang tải kho trò chơi tương tác...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {games.map((g) => (
            <div
              key={g.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-amber-50 transition-colors">
                    {getGameTypeIcon(g.game_type)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <SubjectBadge subject={g.subject} />
                    <GradeBadge grade={g.grade_level} />
                  </div>
                </div>

                <h3 className="text-lg font-black text-slate-800 group-hover:text-brand-600 transition-colors">
                  {g.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
                  {g.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link
                  to={`/games/${g.id}`}
                  className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-brand-500/20 flex items-center justify-center gap-2 transition-all"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>CHƠI NGAY THÔI! ⭐</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Creator Modal */}
      <GameCreatorModal
        isOpen={showGameModal}
        onClose={() => setShowGameModal(false)}
        onGameCreated={handleGameCreated}
      />
    </div>
  );
};
