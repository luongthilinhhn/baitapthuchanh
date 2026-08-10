import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { StarRating } from '../common/KidsBadge';
import { Zap, Trophy, Clock, Check, X, RefreshCw } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export const MathChallenge = ({ game, onFinish }) => {
  const { profile } = useAuth();
  const [num1, setNum1] = useState(3);
  const [num2, setNum2] = useState(2);
  const [operator, setOperator] = useState('+');
  const [userAnswer, setUserAnswer] = useState('');
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isGameOver, setIsGameOver] = useState(false);
  const [feedback, setFeedback] = useState('');

  const generateProblem = () => {
    const isAdd = Math.random() > 0.3;
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;

    if (isAdd) {
      setNum1(a);
      setNum2(b);
      setOperator('+');
    } else {
      const max = Math.max(a, b);
      const min = Math.min(a, b);
      setNum1(max);
      setNum2(min);
      setOperator('-');
    }
  };

  useEffect(() => {
    generateProblem();
  }, []);

  useEffect(() => {
    let timer = null;
    if (!isGameOver && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0 && !isGameOver) {
      handleGameOver();
    }
    return () => clearInterval(timer);
  }, [timeLeft, isGameOver]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const correct = operator === '+' ? num1 + num2 : num1 - num2;
    const val = parseInt(userAnswer, 10);

    if (val === correct) {
      setScore((s) => s + 10 + streak * 2);
      setStreak((s) => s + 1);
      setFeedback('Đúng rồi! 🌟');
      setTimeout(() => setFeedback(''), 800);
    } else {
      setStreak(0);
      setFeedback('Sai rồi bé ơi! ❌');
      setTimeout(() => setFeedback(''), 800);
    }

    setUserAnswer('');
    generateProblem();
  };

  const handleGameOver = async () => {
    setIsGameOver(true);
    confetti({ particleCount: 90, spread: 60 });

    let stars = 3;
    if (score < 40) stars = 1;
    else if (score < 80) stars = 2;

    try {
      if (profile?.id) {
        const record = {
          game_id: game?.id || 'demo-game-math',
          student_id: profile.id,
          score,
          max_score: 150,
          stars,
          completion_time_seconds: 30,
          played_at: new Date().toISOString()
        };
        if (isSupabaseConfigured && supabase) {
          await supabase.from('game_results').insert([record]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6">
      {!isGameOver ? (
        <div className="bg-white rounded-3xl border-2 border-brand-100 p-8 shadow-xl text-center space-y-6">
          {/* Header stats */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-600">
            <span className="flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-xl border border-amber-200">
              <Clock className="w-4 h-4 text-amber-500" />
              {timeLeft}s
            </span>
            <span className="flex items-center gap-1 bg-purple-50 text-purple-700 px-3 py-1 rounded-xl border border-purple-200">
              <Zap className="w-4 h-4 text-purple-500" />
              Streak x{streak}
            </span>
            <span className="text-brand-600 text-sm font-black">Điểm: {score}</span>
          </div>

          {/* Visual objects counting helper for kids */}
          <div className="py-2 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center gap-1 flex-wrap">
            {Array.from({ length: num1 }).map((_, i) => (
              <span key={i} className="text-xl">🍎</span>
            ))}
            <span className="text-lg font-black text-slate-400 mx-2">{operator}</span>
            {Array.from({ length: num2 }).map((_, i) => (
              <span key={i} className="text-xl">🍏</span>
            ))}
          </div>

          {/* Problem display */}
          <div className="text-4xl font-extrabold text-slate-800 tracking-wider">
            {num1} {operator} {num2} = ?
          </div>

          {feedback && (
            <p className="text-sm font-extrabold text-brand-600 animate-pop">{feedback}</p>
          )}

          {/* Input form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="number"
              autoFocus
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="?"
              className="w-32 text-center text-3xl font-black py-2.5 bg-slate-100 border-2 border-slate-300 rounded-2xl focus:border-brand-500 focus:bg-white outline-none"
            />
            <div>
              <button
                type="submit"
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-2xl shadow-md"
              >
                Trả Lời
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-3xl border-2 border-amber-200 shadow-xl text-center space-y-6 animate-pop">
          <Trophy className="w-12 h-12 text-amber-500 mx-auto animate-bounce" />
          <h3 className="text-2xl font-black text-slate-800">HẾT GIỜ! THỬ THÁCH HOÀN THÀNH</h3>
          <p className="text-xl font-bold text-brand-600">Tổng điểm của bé: {score} điểm</p>
          <button
            onClick={() => {
              setScore(0);
              setStreak(0);
              setTimeLeft(30);
              setIsGameOver(false);
              generateProblem();
            }}
            className="px-6 py-3 bg-brand-600 text-white font-bold text-xs rounded-2xl shadow-md inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Thử Thách Lần Nữa</span>
          </button>
        </div>
      )}
    </div>
  );
};
