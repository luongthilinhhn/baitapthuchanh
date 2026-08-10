import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { MatchingGame } from '../../components/games/MatchingGame';
import { QuizGame } from '../../components/games/QuizGame';
import { MathChallenge } from '../../components/games/MathChallenge';
import { LogicMindGame } from '../../components/games/LogicMindGame';
import { ArrowLeft } from 'lucide-react';

export const PlayGame = () => {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGameDetails = async () => {
      if (isSupabaseConfigured && supabase && gameId && !gameId.startsWith('demo-')) {
        try {
          const { data, error } = await supabase
            .from('games')
            .select('*')
            .eq('id', gameId)
            .single();

          if (!error && data) {
            setGame(data);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.error('Error fetching game details:', err);
        }
      }
      setLoading(false);
    };

    fetchGameDetails();
  }, [gameId]);

  const getGameComponent = () => {
    const gameType = game?.game_type || (gameId?.includes('matching') ? 'matching' : gameId?.includes('logic') ? 'logic_mind' : gameId?.includes('quiz') ? 'quiz' : 'math_speed');

    switch (gameType) {
      case 'matching':
        return <MatchingGame game={game || { id: gameId, title: '🎮 Lật Hình Tìm Cặp Từ Vựng' }} />;
      case 'logic_mind':
        return <LogicMindGame game={game || { id: gameId, title: '🧠 Trò Chơi Phát Triển Tư Duy' }} />;
      case 'quiz':
        return <QuizGame game={game || { id: gameId, title: '🧩 Trắc Nghiệm Trực Quan Toán Học' }} />;
      case 'math_speed':
      default:
        return <MathChallenge game={game || { id: gameId, title: '⚡ Thử Thách Tính Nhanh Siêu Tốc' }} />;
    }
  };

  return (
    <div className="space-y-4">
      <Link to="/games" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Quay lại Kho Game
      </Link>
      {loading ? (
        <div className="py-12 text-center text-xs font-semibold text-slate-400">
          Đang tải thông tin trò chơi...
        </div>
      ) : (
        getGameComponent()
      )}
    </div>
  );
};
