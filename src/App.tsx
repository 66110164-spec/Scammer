import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, LEVELS } from './types';
import Level1Link from './components/Level1Link';
import Level2Package from './components/Level2Package';
import Level3Call from './components/Level3Call';
import Level4Meetup from './components/Level4Meetup';
import ProgressBar from './components/ProgressBar';
import Mascot from './components/Mascot';

import { 
  Play, RotateCcw, Heart, Award, ChevronRight, 
  XCircle, PackageOpen, PhoneOff, ShieldX, DollarSign
} from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  
  // [เพิ่มจากระบบคำใบ้] สถานะหยุดเวลา
  const [isPaused, setIsPaused] = useState(false); 
  
  const timerRef = useRef<number | null>(null);
  const currentLevel = LEVELS[currentLevelIdx];

  const startLevel = (idx: number) => {
    const level = LEVELS[idx];
    setCurrentLevelIdx(idx);
    setTimeLeft(level.duration);
    setGameState(GameState.PLAYING);
    setIsPaused(false); // รีเซ็ตสถานะหยุดเวลาทุกครั้งที่เริ่มด่านใหม่
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

  // --- แก้ไขระบบนับเวลา (Timer) ---
  useEffect(() => {
    // ถ้าสถานะเป็น PLAYING และ ไม่ได้ถูกสั่งหยุด (isPaused) ถึงจะเดินเวลา
    if (gameState === GameState.PLAYING && !isPaused) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 0) {
            if (timerRef.current) clearInterval(timerRef.current);
            handleLoseLevel();
            return 0;
          }
          return Math.max(0, prev - 0.1);
        });
      }, 100);
    } else {
      // ถ้าไม่ได้เล่น หรือ ถูกสั่งหยุด ให้ล้าง Interval ทิ้ง (หยุดเวลา)
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, isPaused, handleLoseLevel]); // เพิ่ม isPaused เข้าไปใน Dependency

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
    if (levelId === 1) return <div className="..."><XCircle size={64}/></div>; // ย่อไว้
    if (levelId === 2) return <div className="..."><PackageOpen size={72}/></div>;
    // ... (ส่วนที่เหลือคงเดิมตามโค้ดของคุณ)
    return null;
  };

  const renderContent = () => {
    switch (gameState) {
      case GameState.START:
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-8 px-8 text-center bg-[#F1E9E9]">
             <Mascot className="w-64 h-64" state="happy" />
             <h1 className="text-6xl font-black text-[#15173D]">SCAMMER 101</h1>
             <button onClick={() => startLevel(0)} className="bg-[#15173D] text-white px-14 py-6 rounded-full font-black text-2xl">
               เข้าชั้นเรียน
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
              
              {/* --- แก้ไขการเรียกใช้งาน Level 2 --- */}
              {currentLevelIdx === 1 && (
                <Level2Package 
                  onWin={handleWinLevel} 
                  onLose={handleLoseLevel} 
                  timeLeft={timeLeft} 
                  onTutorialToggle={(isShowing) => setIsPaused(isShowing)} // ส่งฟังก์ชันไปหยุดเวลา
                />
              )}

              {currentLevelIdx === 2 && <Level3Call onWin={handleWinLevel} onLose={handleLoseLevel} timeLeft={timeLeft} />}
              {currentLevelIdx === 3 && <Level4Meetup onWin={handleWinLevel} onLose={handleLoseLevel} timeLeft={timeLeft} />}
            </div>
          </div>
        );

      case GameState.WIN_LEVEL:
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-8 bg-[#F1E9E9]">
            <Award size={100} className="text-[#982598]" />
            <h2 className="text-5xl font-black">สุดยอด!</h2>
            <button onClick={nextAction} className="bg-[#15173D] text-white px-8 py-6 rounded-3xl font-black text-2xl">บทถัดไป</button>
          </div>
        );

      case GameState.LOSE_LEVEL:
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-6 bg-white px-8">
            {renderFailAnimation(currentLevel.id)}
            <p className="font-bold text-center">{currentLevel.failTip}</p>
            <button onClick={nextAction} className="bg-red-600 text-white px-8 py-6 rounded-3xl font-black text-2xl italic">ลองใหม่</button>
          </div>
        );

      case GameState.GAME_OVER:
        return (
          <div className="flex flex-col items-center justify-center h-full bg-[#15173D] space-y-10">
            <h2 className="text-5xl font-black text-white italic">จบการเรียน</h2>
            <div className="text-5xl font-black text-[#E491C9]">{score} แต้ม</div>
            <button onClick={restartGame} className="bg-white text-[#15173D] px-8 py-6 rounded-full font-black text-2xl">เริ่มใหม่</button>
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