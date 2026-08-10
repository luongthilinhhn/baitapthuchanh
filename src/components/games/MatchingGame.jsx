import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { StarRating } from '../common/KidsBadge';
import { Trophy, RefreshCw, ArrowLeft, Sparkles, CheckCircle, Clock } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export const MatchingGame = ({ game, onFinish }) => {
  const { profile } = useAuth();
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [stars, setStars] = useState(3);
  const [score, setScore] = useState(0);

  // Initialize cards from game config or defaults
  useEffect(() => {
    const rawPairs = game?.config?.pairs || [
      { id: 1, text: 'Quả Táo 🍎', matchId: 1, type: 'text' },
      { id: 2, text: 'Apple 🍏', matchId: 1, type: 'text' },
      { id: 3, text: 'Mặt Trời ☀️', matchId: 2, type: 'text' },
      { id: 4, text: 'Sun 🌞', matchId: 2, type: 'text' },
      { id: 5, text: '2 + 3 = ?', matchId: 3, type: 'text' },
      { id: 6, text: '5 🖐️', matchId: 3, type: 'text' },
      { id: 7, text: 'Con Mèo 🐱', matchId: 4, type: 'text' },
      { id: 8, text: 'Cat 🐈', matchId: 4, type: 'text' }
    ];

    // Shuffle cards
    const shuffled = [...rawPairs].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setTimer(0);
    setIsCompleted(false);
  }, [game]);

  // Timer interval
  useEffect(() => {
    let interval = null;
    if (!isCompleted) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCompleted]);

  const handleCardClick = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) {
      return;
    }

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const card1 = cards[newFlipped[0]];
      const card2 = cards[newFlipped[1]];

      if (card1.matchId === card2.matchId && newFlipped[0] !== newFlipped[1]) {
        // Match found!
        const newMatched = [...matched, newFlipped[0], newFlipped[1]];
        setMatched(newMatched);
        setFlipped([]);

        // Check victory
        if (newMatched.length === cards.length) {
          handleVictory(moves + 1, timer);
        }
      } else {
        // Not a match, reset after 800ms
        setTimeout(() => {
          setFlipped([]);
        }, 850);
      }
    }
  };

  const handleVictory = async (finalMoves, finalTimer) => {
    setIsCompleted(true);
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });

    // Calculate stars: perfect <= 6 moves = 3 stars, <= 10 = 2 stars, > 10 = 1 star
    let earnedStars = 3;
    if (finalMoves > 10) earnedStars = 1;
    else if (finalMoves > 6) earnedStars = 2;

    const calcScore = Math.max(10, 100 - (finalMoves - cards.length / 2) * 5 - Math.floor(finalTimer / 3));

    setStars(earnedStars);
    setScore(calcScore);

    // Save score to Database
    try {
      if (profile?.id) {
        const resultRecord = {
          game_id: game?.id || 'demo-game-matching',
          student_id: profile.id,
          score: calcScore,
          max_score: 100,
          stars: earnedStars,
          completion_time_seconds: finalTimer,
          played_at: new Date().toISOString()
        };

        if (isSupabaseConfigured && supabase) {
          await supabase.from('game_results').insert([resultRecord]);
        }
      }
    } catch (e) {
      console.error('Failed to save game result:', e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500" />
            {game?.title || 'Game Lật Hình Tìm Cặp Tương Xứng'}
          </h2>
          <p className="text-xs text-slate-500">Hãy tìm các cặp hình/từ vựng ghép với nhau!</p>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold text-slate-700">
          <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-xl border border-amber-200">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>{timer}s</span>
          </div>
          <div className="flex items-center gap-1.5 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-xl border border-purple-200">
            <Trophy className="w-4 h-4 text-purple-500" />
            <span>{moves} Lần lật</span>
          </div>
        </div>
      </div>

      {/* Main Grid Game Area */}
      {!isCompleted ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {cards.map((card, idx) => {
            const isFlipped = flipped.includes(idx) || matched.includes(idx);
            const isMatch = matched.includes(idx);

            return (
              <button
                key={idx}
                onClick={() => handleCardClick(idx)}
                className={`h-36 rounded-2xl font-extrabold text-base transition-all duration-300 transform perspective-1000 flex items-center justify-center p-3 text-center shadow-md ${
                  isMatch
                    ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-400 scale-95 opacity-80'
                    : isFlipped
                    ? 'bg-amber-100 text-slate-800 border-2 border-amber-400 rotate-y-180'
                    : 'bg-gradient-to-br from-brand-500 to-indigo-600 text-white hover:scale-105 border-2 border-brand-400 cursor-pointer'
                }`}
              >
                {isFlipped ? (
                  <span className="animate-pop text-lg font-bold">{card.text}</span>
                ) : (
                  <span className="text-3xl font-extrabold text-white/80">❓</span>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        /* Celebration Victory Screen */
        <div className="bg-white p-8 rounded-3xl border-2 border-amber-200 shadow-xl text-center space-y-6 animate-pop">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-500 shadow-inner">
            <Trophy className="w-10 h-10 animate-bounce" />
          </div>

          <div>
            <h3 className="text-2xl font-extrabold text-slate-800">XUẤT SẮC CẢM ƠN BẠN!</h3>
            <p className="text-sm text-slate-500 mt-1">Bạn đã hoàn thành trò chơi thành công!</p>
          </div>

          <div className="flex justify-center">
            <StarRating count={stars} size="lg" />
          </div>

          <div className="inline-flex gap-6 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-200">
            <div>
              <p className="text-[11px] text-slate-400 font-bold uppercase">Điểm số</p>
              <p className="text-2xl font-black text-brand-600">{score} / 100</p>
            </div>
            <div className="border-r border-slate-200"></div>
            <div>
              <p className="text-[11px] text-slate-400 font-bold uppercase">Thời gian</p>
              <p className="text-2xl font-black text-amber-600">{timer} giây</p>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => {
                const shuffled = [...cards].sort(() => Math.random() - 0.5);
                setCards(shuffled);
                setFlipped([]);
                setMatched([]);
                setMoves(0);
                setTimer(0);
                setIsCompleted(false);
              }}
              className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-brand-500/30 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Chơi Lại Trận Mới</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
