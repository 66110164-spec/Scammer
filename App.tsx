
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, LEVELS } from './types';
import Level1Link from './components/Level1Link';
import Level2Package from './components/Level2Package';
import Level3Call from './components/Level3Call';
import Level4Meetup from './components/Level4Meetup';
import ProgressBar from './components/ProgressBar';
import Mascot from './components/Mascot';
import { 
  Play, RotateCcw, Heart, ShieldAlert, Award, ChevronRight, 
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
            return 0;
          }
          return Math.max(0, prev - 0.1);
        });
      }, 100);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

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
            <div className="absolute -top-6 -right-6">
               <DollarSign size={48} className="text-green-600 money-fly" />
            </div>
            <div className="absolute -top-12 -left-4">
               <DollarSign size={32} className="text-green-600 money-fly" style={{ animationDelay: '0.4s' }} />
            </div>
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
              <div className="absolute -bottom-4 right-0 transform translate-x-1/2">
                 <UserX size={48} className="text-red-600 shake bg-white rounded-full p-2 border-2 border-[#15173D]" />
              </div>
              <p className="mt-8 text-sm font-black text-red-600 uppercase tracking-tighter">ข้อมูลส่วนตัวรั่วไหล!</p>
           </div>
        </div>
      );
    } else if (levelId === 3) {
      return (
        <div className="relative h-44 w-full flex items-center justify-center">
          <div className="relative">
             <div className="bg-[#15173D] p-8 rounded-full border-4 border-[#982598] animate-pulse">
                <PhoneOff size={80} className="text-white" />
             </div>
             <div className="absolute top-0 right-0">
                <AlertCircle size={40} className="text-red-500 bg-white rounded-full" />
             </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="relative h-44 w-full flex items-center justify-center">
          <div className="relative flex flex-col items-center">
            <div className="bg-red-100 p-8 rounded-3xl border-4 border-red-600 shake">
              <ShieldX size={80} className="text-red-600" />
            </div>
            <div className="absolute -top-4 -right-4 bg-white p-2 rounded-full border-2 border-red-600">
              <MapPin size={32} className="text-red-600" />
            </div>
            <p className="mt-4 text-sm font-black text-red-600 uppercase">อันตรายมาก!</p>
          </div>
        </div>
      );
    }
  };

  const renderContent = () => {
    const currentLevel = LEVELS[currentLevelIdx];

    switch (gameState) {
      case GameState.START:
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-8 px-8 text-center bg-[#F1E9E9]">
            <Mascot className="w-64 h-64" />
            
            <div className="space-y-4">
              <h1 className="text-6xl font-black text-[#15173D] tracking-tighter leading-none italic uppercase">
                SCAMMER<br/><span className="text-[#982598] text-7xl">101</span>
              </h1>
              <div className="flex justify-center space-x-3">
                {[...Array(3)].map((_, i) => (
                  <Heart key={i} className="text-red-500 fill-current" size={32} />
                ))}
              </div>
              <p className="text-[#15173D]/60 font-bold text-sm max-w-[240px] mx-auto leading-tight uppercase tracking-widest">
                บทเรียนเอาตัวรอดจากมิจฉาชีพ
              </p>
            </div>
            
            <button 
              onClick={() => startLevel(0)}
              className="group flex items-center space-x-3 bg-[#15173D] hover:bg-[#982598] text-white px-14 py-6 rounded-[2.5rem] text-2xl font-black shadow-2xl transition-all transform hover:scale-105 active:scale-95"
            >
              <Play className="fill-current" />
              <span>เข้าชั้นเรียน</span>
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
                    <Heart 
                      key={i} 
                      size={24} 
                      className={`${i < lives ? 'text-red-500 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <div className="bg-[#15173D] px-5 py-2 rounded-full text-white font-black text-sm border-2 border-[#982598]">
                  {score} PTS
                </div>
              </div>
              <ProgressBar progress={timeLeft / currentLevel.duration} />
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-[#15173D]/40 font-black uppercase tracking-[0.3em]">บทที่ {currentLevel.id}</span>
                <h2 className="text-2xl font-black text-[#15173D] uppercase tracking-tighter italic">{currentLevel.title}</h2>
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
          <div className="flex flex-col items-center justify-center h-full space-y-8 animate-in slide-in-from-bottom duration-500 px-12 text-center bg-[#F1E9E9]">
            <div className="bg-white p-10 rounded-[3.5rem] border-8 border-[#982598] shadow-2xl animate-bounce">
              <Award size={100} className="text-[#982598]" />
            </div>
            <div className="space-y-2">
              <h2 className="text-5xl font-black text-[#15173D] uppercase italic tracking-tighter">สุดยอด!</h2>
              <p className="text-[#982598] font-bold text-lg">คุณปลอดภัยแล้วในด่านนี้</p>
            </div>
            <button 
              onClick={nextAction}
              className="w-full flex justify-center items-center space-x-3 bg-[#15173D] text-white px-8 py-6 rounded-3xl font-black text-2xl hover:bg-[#982598] transition-all shadow-xl group"
            >
              <span>{currentLevelIdx < LEVELS.length - 1 ? 'บทถัดไป' : 'ดูใบประกาศ'}</span>
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        );

      case GameState.LOSE_LEVEL:
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-6 animate-in fade-in duration-300 px-8 text-center bg-white">
            {renderFailAnimation(currentLevel.id)}
            
            <div className="space-y-4">
              <h2 className="text-5xl font-black text-red-600 uppercase italic tracking-tighter">ติดกับดัก!</h2>
              <div className="bg-[#F1E9E9] p-6 rounded-[2rem] border-4 border-red-100">
                <p className="text-[#15173D] font-bold leading-relaxed text-sm">
                  <span className="text-red-500 block text-lg mb-2 font-black uppercase tracking-widest">💡 วิธีแก้ไข:</span>
                  {currentLevel.failTip}
                </p>
              </div>
            </div>
            
            <button 
              onClick={nextAction}
              className="w-full flex justify-center items-center space-x-3 bg-red-600 text-white px-8 py-6 rounded-3xl font-black text-2xl hover:bg-red-700 shadow-xl transition-transform active:scale-95"
            >
              <RotateCcw size={28} />
              <span>{lives > 0 ? 'ลองใหม่' : 'ไปหน้าสรุป'}</span>
            </button>
            {lives > 0 && <p className="text-red-400 font-black text-xs uppercase tracking-widest">เหลือ {lives} โอกาส</p>}
          </div>
        );

      case GameState.GAME_OVER:
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-10 px-8 text-center animate-in zoom-in duration-500 bg-[#15173D]">
            <Mascot className="w-72 h-72 opacity-80" />
            <div className="space-y-4">
              <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none">สรุปผลการเรียน</h2>
              <div className="text-5xl font-black text-[#E491C9] bg-white/5 px-8 py-4 rounded-full inline-block border-2 border-[#982598]">
                {score} <span className="text-xl">แต้ม</span>
              </div>
            </div>
            <p className="text-[#F1E9E9]/60 font-medium italic text-sm px-4">
              "ความรู้วันนี้ จะเป็นเกราะป้องกันคุณในโลกจริง"
            </p>
            <button 
              onClick={restartGame}
              className="w-full flex justify-center items-center space-x-3 bg-white text-[#15173D] px-8 py-6 rounded-[2.5rem] font-black text-2xl hover:bg-[#E491C9] transition-all shadow-2xl"
            >
              <RotateCcw size={28} />
              <span>เรียนซ้ำอีกครั้ง</span>
            </button>
          </div>
        );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0A0B1A] font-sans p-4">
      <div className="w-full max-w-[420px] aspect-[9/18] bg-[#F1E9E9] rounded-[4rem] shadow-[0_40px_80px_rgba(0,0,0,0.6)] overflow-hidden border-[12px] border-[#15173D] relative">
        <div className="h-full">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default App;
