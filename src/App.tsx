import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, LEVELS } from './types';
import Level1Link from './components/Level1Link';
import Level2Package from './components/Level2Package';
import Level3Call from './components/Level3Call';
import Level4Meetup from './components/Level4Meetup';
import ProgressBar from './components/ProgressBar';
import Mascot from './components/Mascot';
import { ASSET_CONFIG } from './assets'; // ถ้าไฟล์ assets.ts อยู่ที่เดียวกับ App.tsx

import { 
  Play, RotateCcw, Heart, Award, ChevronRight, 
  XCircle, UserX, DollarSign, PackageOpen, PhoneOff, AlertCircle,
  MapPin, ShieldX
} from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const timerRef = useRef<number | null>(null);

  // ดึงข้อมูลด่านปัจจุบัน
  const currentLevel = LEVELS[currentLevelIdx];

  const startLevel = (idx: number) => {
    const level = LEVELS[idx];
    setCurrentLevelIdx(idx);
    setTimeLeft(level.duration);
    setGameState(GameState.PLAYING);
  };

  const handleWinLevel = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setScore(s => s + Math.ceil(timeLeft * 10) + 150);
    setGameState(GameState.WIN_LEVEL);
  }, [timeLeft]);

  const handleLoseLevel = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setLives(l => l - 1);
    setGameState(GameState.LOSE_LEVEL);
  }, []);

  useEffect(() => {
    if (gameState === GameState.PLAYING) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 0) {
            if (timerRef.current) clearInterval(timerRef.current);
            handleLoseLevel(); // เมื่อหมดเวลาให้ถือว่าแพ้
            return 0;
          }
          return Math.max(0, prev - 0.1);
        });
      }, 100);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, handleLoseLevel]);

  const nextAction = () => {
    if (lives <= 0) {
      setGameState(GameState.GAME_OVER);
    } else if (gameState === GameState.LOSE_LEVEL) {
      startLevel(currentLevelIdx);
    } else {
      if (currentLevelIdx < LEVELS.length - 1) {
        startLevel(currentLevelIdx + 1);
      } else {
        setGameState(GameState.GAME_OVER);
      }
    }
  };

  const restartGame = () => {
    setScore(0);
    setLives(3);
    setCurrentLevelIdx(0);
    startLevel(0);
  };

  const renderFailAnimation = (levelId: number) => {
    if (levelId === 1) {
      return (
        <div className="relative h-44 w-full flex items-center justify-center">
          <div className="relative bg-white border-4 border-[#15173D] rounded-3xl p-6 flex flex-col items-center shadow-lg">
            <XCircle size={64} className="text-red-500 mb-2 shake" />
            <div className="absolute -top-6 -right-6"><DollarSign size={48} className="text-green-600 money-fly" /></div>
            <p className="text-sm font-black text-[#15173D]">เงินของคุณหายไปแล้ว!</p>
          </div>
        </div>
      );
    } else if (levelId === 2) {
      return (
        <div className="relative h-44 w-full flex items-center justify-center">
           <div className="relative flex flex-col items-center">
              <div className="bg-[#E491C9] p-6 rounded-2xl border-4 border-[#15173D] shadow-xl">
                 <PackageOpen size={72} className="text-[#15173D]" />
              </div>
              <p className="mt-8 text-sm font-black text-red-600 uppercase">ข้อมูลรั่วไหล!</p>
           </div>
        </div>
      );
    } else if (levelId === 3) {
      return (
        <div className="relative h-44 w-full flex items-center justify-center">
          <div className="bg-[#15173D] p-8 rounded-full border-4 border-[#982598] animate-pulse">
            <PhoneOff size={80} className="text-white" />
          </div>
        </div>
      );
    } else {
      return (
        <div className="relative h-44 w-full flex items-center justify-center">
          <ShieldX size={80} className="text-red-600 shake" />
        </div>
      );
    }
  };

  const renderContent = () => {
    switch (gameState) {
      case GameState.START:
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-8 px-8 text-center bg-[#F1E9E9]">
            <Mascot className="w-64 h-64" state="happy" />
            <div className="space-y-4">
              <h1 className="text-6xl font-black text-[#15173D] tracking-tighter leading-none italic uppercase">
                SCAMMER<br/><span className="text-[#982598] text-7xl">101</span>
              </h1>
              <p className="text-[#15173D]/60 font-bold text-sm uppercase tracking-widest">บทเรียนเอาตัวรอดจากมิจฉาชีพ</p>
            </div>
            <button onClick={() => startLevel(0)} className="bg-[#15173D] hover:bg-[#982598] text-white px-14 py-6 rounded-[2.5rem] text-2xl font-black shadow-2xl transition-all">
              <Play className="inline mr-2 fill-current" /> เข้าชั้นเรียน
            </button>
          </div>
        );

      case GameState.PLAYING:
        return (
          <div className="flex flex-col h-full bg-[#F1E9E9]">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex space-x-1.5">
                  {[...Array(3)].map((_, i) => (
                    <Heart key={i} size={24} className={i < lives ? 'text-red-500 fill-current' : 'text-gray-300'} />
                  ))}
                </div>
                <div className="bg-[#15173D] px-5 py-2 rounded-full text-white font-black text-sm">{score} PTS</div>
              </div>
              <ProgressBar progress={timeLeft / currentLevel.duration} />
              <div className="text-center">
                <span className="text-[10px] text-[#15173D]/40 font-black uppercase">บทที่ {currentLevel.id}</span>
                <h2 className="text-2xl font-black text-[#15173D] uppercase italic">{currentLevel.title}</h2>
              </div>
            </div>
            <div className="flex-1 overflow-hidden relative">
              {currentLevelIdx === 0 && <Level1Link onWin={handleWinLevel} onLose={handleLoseLevel} timeLeft={timeLeft} />}
              {currentLevelIdx === 1 && <Level2Package onWin={handleWinLevel} onLose={handleLoseLevel} timeLeft={timeLeft} />}
              {currentLevelIdx === 2 && <Level3Call onWin={handleWinLevel} onLose={handleLoseLevel} timeLeft={timeLeft} />}
              {currentLevelIdx === 3 && <Level4Meetup onWin={handleWinLevel} onLose={handleLoseLevel} timeLeft={timeLeft} />}
            </div>
          </div>
        );

      case GameState.WIN_LEVEL:
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-8 px-12 text-center bg-[#F1E9E9]">
            <div className="bg-white p-10 rounded-[3.5rem] border-8 border-[#982598] shadow-2xl animate-bounce">
              <Award size={100} className="text-[#982598]" />
            </div>
            <h2 className="text-5xl font-black text-[#15173D] uppercase italic">สุดยอด!</h2>
            <button onClick={nextAction} className="w-full flex justify-center items-center bg-[#15173D] text-white px-8 py-6 rounded-3xl font-black text-2xl">
              <span>{currentLevelIdx < LEVELS.length - 1 ? 'บทถัดไป' : 'ดูใบประกาศ'}</span> <ChevronRight />
            </button>
          </div>
        );

      case GameState.LOSE_LEVEL:
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-6 px-8 text-center bg-white">
            {renderFailAnimation(currentLevel.id)}
            <div className="bg-[#F1E9E9] p-6 rounded-[2rem] border-4 border-red-100">
              <p className="text-[#15173D] font-bold text-sm">
                <span className="text-red-500 block text-lg font-black">💡 วิธีแก้ไข:</span>
                {currentLevel.failTip}
              </p>
            </div>
            <button onClick={nextAction} className="w-full bg-red-600 text-white px-8 py-6 rounded-3xl font-black text-2xl">
              <RotateCcw className="inline mr-2" /> {lives > 0 ? 'ลองใหม่' : 'ไปหน้าสรุป'}
            </button>
          </div>
        );

      case GameState.GAME_OVER:
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-10 px-8 text-center bg-[#15173D]">
            <Mascot className="w-72 h-72 opacity-80" state={score > 500 ? 'happy' : 'scared'} />
            <div className="space-y-4 text-white">
              <h2 className="text-5xl font-black italic uppercase">สรุปผลการเรียน</h2>
              <div className="text-5xl font-black text-[#E491C9]">{score} แต้ม</div>
            </div>
            <button onClick={restartGame} className="w-full bg-white text-[#15173D] px-8 py-6 rounded-[2.5rem] font-black text-2xl">
              เริ่มเรียนใหม่
            </button>
          </div>
        );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0A0B1A] p-4">
      <div className="w-full max-w-[420px] aspect-[9/18] bg-[#F1E9E9] rounded-[4rem] shadow-2xl overflow-hidden border-[12px] border-[#15173D]">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;