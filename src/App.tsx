import React, { useState, useEffect, useCallback, useRef } from 'react';
import { LEVELS } from './data/levels';
import { GameState } from './types';
import LevelSwitcher from './components/LevelSwitcher';
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

  // ฟังก์ชันรีเซ็ตที่ถูกต้อง (แก้ Error เดิม)
  const handleRetry = useCallback(() => {
    startLevel(currentLevelIdx);
  }, [currentLevelIdx]);

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
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.log(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };
  const renderContent = () => {
    switch (gameState) {
      case GameState.START:
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-8 px-8 bg-[#F1E9E9]">
            <Mascot className="w-48 h-48" state="happy" />
            <h1 className="text-5xl font-black text-[#15173D] italic uppercase text-center">SCAMMER 101</h1>

            <div className="flex flex-col gap-3 w-full max-w-sm">
              <input placeholder="ชื่อของคุณ" className="p-4 rounded-2xl border-2 border-[#15173D] font-bold" onChange={(e) => setUserName(e.target.value)} />
              <input type="number" placeholder="อายุ" className="p-4 rounded-2xl border-2 border-[#15173D] font-bold" onChange={(e) => setUserAge(Number(e.target.value))} />
            </div>

            <button onClick={() => startLevel(0)} className="bg-[#15173D] text-white px-12 py-5 rounded-full font-black text-xl w-full max-w-sm uppercase italic">
              START CLASS
            </button>

            {/* ย้ายปุ่มนี้มาไว้ข้างในนี้ครับ */}
            <button onClick={toggleFullscreen} className="text-[10px] text-[#15173D]/60 underline">
              เล่นแบบเต็มหน้าจอ (Fullscreen)
            </button>
          </div>
        );

      case GameState.PLAYING:
        return (
          <div className="flex flex-col h-full w-full bg-[#F1E9E9] relative overflow-hidden">
            {!isPaused && (
              <div className="flex-none p-6 pb-2 space-y-3 z-10">
                <div className="flex justify-between items-center">
                  <div className="flex space-x-1">
                    {[...Array(3)].map((_, i) => (
                      <Heart key={i} size={22} className={i < lives ? 'text-red-500 fill-current' : 'text-gray-300'} />
                    ))}
                  </div>
                  <div className="bg-[#15173D] px-4 py-1 rounded-full text-[#F1E9E9] font-black text-xs shadow-md">
                    {score} PTS
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-[#15173D]/40 text-[10px] font-black uppercase tracking-[0.2em]">บทที่ {currentLevel.id}</p>
                  <h2 className="text-[#15173D] text-lg font-black italic uppercase leading-tight truncate">{currentLevel.title}</h2>
                </div>
                <ProgressBar progress={Math.max(0, timeLeft / currentLevel.duration)} />
              </div>
            )}

            <div className="flex-1 mt-2 overflow-hidden rounded-t-[3.5rem] bg-[#15173D] relative">
              <LevelSwitcher
                levelIdx={currentLevelIdx}
                onWin={handleWinLevel}
                onLose={handleLoseLevel}
                timeLeft={timeLeft}
                onTutorialToggle={setIsPaused}
                onRetry={() => startLevel(currentLevelIdx)}
              />
            </div>
          </div>
        );

      case GameState.WIN_LEVEL:
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-8 bg-[#F1E9E9] p-8 text-center">
            <Award size={100} className="text-[#982598]" />
            <h2 className="text-5xl font-black text-[#15173D] italic uppercase">สุดยอด!</h2>
            <button onClick={nextAction} className="w-full bg-[#15173D] text-white py-6 rounded-3xl font-black text-2xl uppercase italic">บทถัดไป</button>
          </div>
        );

      case GameState.LOSE_LEVEL:
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-6 bg-white px-8 text-center">
            <XCircle size={80} className="text-red-500" />
            <p className="font-black text-[#15173D] text-lg px-4">{currentLevel.failTip}</p>
            <button onClick={nextAction} className="w-full bg-red-600 text-white py-6 rounded-3xl font-black text-2xl italic uppercase">ลองใหม่</button>
          </div>
        );

      case GameState.GAME_OVER:
        return (
          <ScoreBoard
            name={userName}
            age={userAge}
            score={score}
            onRestart={() => { setScore(0); setLives(3); setGameState(GameState.START); }}
          />
        );

      default: return null;
    }
  };

return (
    <div className="flex items-center justify-center min-h-[100dvh] bg-[#0A0B1A] p-0 sm:p-4 touch-none">
      <div className="relative w-full max-w-[430px] h-[100dvh] sm:h-[92vh] bg-[#F1E9E9] sm:rounded-[3rem] shadow-2xl flex flex-col overflow-hidden pointer-events-auto">
        
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#15173D]/10 rounded-b-2xl z-[50] pointer-events-none" />
        
        {/* Main Content Area */}
        <div className="flex-1 relative overflow-hidden">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}; // <--- The component function closes here

export default App;
