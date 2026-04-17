import React, { useState, useEffect, useCallback, useRef } from 'react';
import { LEVELS } from './data/levels';
import { GameState } from './types';
import LevelSwitcher from './components/LevelSwitcher';
import Level1Link from './components/Level1Link';
import Level2Package from './components/Level2Package';
import Level3Call from './components/Level3Call';
import Level4Meetup from './components/Level4Meetup';
import Level6TikTokScam from './components/Level6TikTokScam';
import ProgressBar from './components/ProgressBar';
import Mascot from './components/Mascot';
import ScoreBoard from './components/ScoreBoard'; 

import { Heart, Award, XCircle } from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const [userName, setUserName] = useState("Player"); 
  const [userAge, setUserAge] = useState(20);

  const timerRef = useRef<number | null>(null);
  const currentLevel = LEVELS[currentLevelIdx];

  const startLevel = (idx: number) => {
    setCurrentLevelIdx(idx);
    setTimeLeft(LEVELS[idx].duration);
    setGameState(GameState.PLAYING);
    setIsPaused(false);
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
    if (gameState === GameState.PLAYING && !isPaused) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 0) {
            handleLoseLevel();
            return 0;
          }
          return Math.max(0, prev - 0.1);
        });
      }, 100);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [gameState, isPaused, handleLoseLevel]);

  const nextAction = () => {
    if (lives <= 0) {
      setGameState(GameState.GAME_OVER);
    } else if (gameState === GameState.LOSE_LEVEL) {
      startLevel(currentLevelIdx);
    } else {
      if (currentLevelIdx < LEVELS.length - 1) startLevel(currentLevelIdx + 1);
      else setGameState(GameState.GAME_OVER);
    }
  };

  const renderContent = () => {
    switch (gameState) {
      case GameState.START:
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-8 px-8 bg-[#F1E9E9] animate-in fade-in duration-500">
            <Mascot className="w-48 h-48" state="happy" />
            <h1 className="text-5xl font-black text-[#15173D] italic uppercase tracking-tighter text-center leading-none">SCAMMER 101</h1>

            <div className="flex flex-col gap-3 w-full">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#15173D]/40 ml-2">Identify Yourself</label>
              <input
                placeholder="ชื่อของคุณ"
                className="p-4 rounded-2xl border-2 border-[#15173D] font-bold focus:ring-4 ring-[#E491C9]/20 outline-none transition-all"
                onChange={(e) => setUserName(e.target.value)}
              />
              <input
                type="number"
                placeholder="อายุ"
                className="p-4 rounded-2xl border-2 border-[#15173D] font-bold focus:ring-4 ring-[#E491C9]/20 outline-none transition-all"
                onChange={(e) => setUserAge(Number(e.target.value))}
              />
            </div>

            <button
              onClick={() => startLevel(8)} //ไว้ Skip ด่าน
              className="bg-[#15173D] text-white px-12 py-5 rounded-full font-black text-xl shadow-[0_10px_0_rgb(0,0,0,0.2)] active:shadow-none active:translate-y-1 transition-all w-full uppercase italic"
            >
              START CLASS
            </button>
          </div>
        );

      case GameState.PLAYING:
        return (
          <div className="flex flex-col h-full bg-[#F1E9E9] relative">
            <div className="p-6 pb-2 space-y-4 z-10">
              <div className="flex justify-between items-center">
                <div className="flex space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <Heart key={i} size={22} className={i < lives ? 'text-red-500 fill-current' : 'text-gray-300'} />
                  ))}
                </div>
                <div className="bg-[#15173D] px-4 py-1 rounded-full text-[#F1E9E9] font-black text-xs">{score} PTS</div>
              </div>
              <ProgressBar progress={timeLeft / currentLevel.duration} />
            </div>

            <div className="text-center w-full pt-2 flex flex-col items-center justify-center">
              <p className="text-[#15173D]/40 text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-1">
                บทที่ {currentLevel.id}
              </p>
              <h2 className="text-[#15173D] text-xl sm:text-2xl font-black italic uppercase leading-tight max-w-[80%]">
                {currentLevel.title}
              </h2>
            </div>

            <div className="flex-1 relative mt-4 overflow-hidden rounded-t-[3.5rem] bg-[#15173D]">
              {/* เรียกใช้ LevelSwitcher เพียงตัวเดียว */}
              <LevelSwitcher 
                levelIdx={currentLevelIdx}
                onWin={handleWinLevel}
                onLose={handleLoseLevel}
                timeLeft={timeLeft}
                onTutorialToggle={setIsPaused}
              />
            </div>
          </div>
        );

      case GameState.WIN_LEVEL:
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-8 bg-[#F1E9E9] p-8 text-center animate-in zoom-in duration-300">
            <Award size={100} className="text-[#982598]" />
            <h2 className="text-5xl font-black text-[#15173D] italic uppercase">สุดยอด!</h2>
            <button onClick={nextAction} className="w-full bg-[#15173D] text-white py-6 rounded-3xl font-black text-2xl shadow-xl uppercase italic">บทถัดไป</button>
          </div>
        );

      case GameState.LOSE_LEVEL:
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-6 bg-white px-8 text-center animate-in shake duration-500">
            <XCircle size={80} className="text-red-500 animate-bounce" />
            <p className="font-black text-[#15173D] text-lg leading-snug">{currentLevel.failTip}</p>
            <button onClick={nextAction} className="w-full bg-red-600 text-white py-6 rounded-3xl font-black text-2xl italic shadow-lg uppercase">ลองใหม่</button>
          </div>
        );

      case GameState.GAME_OVER:
        return (
          <ScoreBoard
            name={userName}
            age={userAge}
            score={score}
            onRestart={() => {
              setScore(0);
              setLives(3);
              setGameState(GameState.START);
            }}
          />
        );

      default: return null;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0A0B1A] font-sans p-0 sm:p-4 transition-colors duration-500">
      {/* Container หลัก: ปรับให้ไร้ขอบ และโค้งมนสวยงามตามรูป */}
      <div className="relative w-full max-w-[430px] h-screen sm:h-[92vh] bg-[#F1E9E9] sm:rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden">
        
        {/* Notch แบบบางๆ */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#15173D]/10 rounded-b-2xl z-[50] pointer-events-none" />
        
        {/* พื้นที่ Content หลัก */}
        <div className="flex-1 relative overflow-hidden">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default App;