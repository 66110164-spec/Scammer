import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, Coins, Zap, Flame, AlertCircle, Sparkles, MoveUp } from 'lucide-react';
import TutorialOverlay from './TutorialOverlay';

interface Props {
  onWin: () => void;
  onLose: () => void;
  timeLeft: number;
  onTutorialToggle: (isShowing: boolean) => void;
}

const Level13CryptoScam: React.FC<Props> = ({ onWin, onLose, timeLeft, onTutorialToggle }) => {
  const [showTutorial, setShowTutorial] = useState(true);
  const [tutorialTimer, setTutorialTimer] = useState(5);
  
  // Game State
  const [charY, setCharY] = useState(0); // 0 คือบนพื้น (บนกราฟ)
  const [isJumping, setIsJumping] = useState(false);
  const [isCrashed, setIsCrashed] = useState(false);
  const [obstacles, setObstacles] = useState<{ id: number; x: number }[]>([]);
  
  const gameFrame = useRef(0);
  const obstacleId = useRef(0);
  const requestRef = useRef<number>(0);

  // 1. Tutorial Logic
  useEffect(() => {
    if (onTutorialToggle) onTutorialToggle(showTutorial);
    if (showTutorial && tutorialTimer > 0) {
      const timer = setTimeout(() => setTutorialTimer(tutorialTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (tutorialTimer === 0) setShowTutorial(false);
  }, [tutorialTimer, showTutorial, onTutorialToggle]);

  // 2. Jump Logic
  const handleJump = () => {
    if (showTutorial || isJumping || isCrashed) return;
    setIsJumping(true);
    
    // Jump Animation Sequence
    let height = 0;
    let up = true;
    const jumpInterval = setInterval(() => {
      if (up) {
        height += 8;
        if (height >= 120) up = false;
      } else {
        height -= 8;
        if (height <= 0) {
          height = 0;
          setIsJumping(false);
          clearInterval(jumpInterval);
        }
      }
      setCharY(height);
    }, 20);
  };

  // 3. Game Loop (Obstacles & Collision)
  useEffect(() => {
    if (showTutorial || isCrashed) return;

    const update = () => {
      gameFrame.current++;

      // สร้างปุ่มฝากเงิน (Obstacles)
      if (gameFrame.current % 120 === 0) {
        setObstacles(prev => [...prev, { id: obstacleId.current++, x: 110 }]);
      }

      setObstacles(prev => {
        const next = prev.map(ob => ({ ...ob, x: ob.x - 0.9 })); // ความเร็วของปุ่ม (ปรับให้ช้าลง)
        
        // Check Collision
        const hit = next.find(ob => ob.x > 15 && ob.x < 35 && charY < 40);
        if (hit) {
          setIsCrashed(true);
          setTimeout(() => onLose(), 1500);
          return [];
        }

        return next.filter(ob => ob.x > -20);
      });

      requestRef.current = requestAnimationFrame(update);
    };

    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current);
  }, [showTutorial, charY, isCrashed, onLose]);

  // Win Condition
  useEffect(() => {
    if (!showTutorial && !isCrashed && timeLeft <= 0) {
      onWin();
    }
  }, [timeLeft, onWin, showTutorial, isCrashed]);

  return (
    <div 
      className={`absolute inset-0 overflow-hidden font-sans select-none touch-none transition-colors duration-700
        ${isCrashed ? 'bg-rose-950' : 'bg-[#020617]'}`}
      onPointerDown={handleJump}
    >
      {/* Background Graph Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <path 
          d="M 0 400 Q 150 350 300 380 T 600 300 T 900 350" 
          fill="none" 
          stroke={isCrashed ? "#f43f5e" : "#10b981"} 
          strokeWidth="4"
          className={isCrashed ? "" : "animate-pulse"}
        />
      </svg>

      {/* --- CHARACTER: The Crypto Rider --- */}
      <div 
        className="absolute left-[20%] bottom-[30%] transition-transform duration-75"
        style={{ transform: `translateY(-${charY}px)` }}
      >
        <div className="relative">
          {isCrashed ? (
            <div className="flex flex-col items-center animate-bounce">
              <Flame size={60} className="text-orange-500" />
              <div className="bg-black/80 px-3 py-1 rounded text-white text-[10px] font-black">แมงเม่า!</div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Coins size={50} className="text-amber-400 animate-spin-slow" />
              <div className="absolute -top-10 flex gap-1">
                <Sparkles size={16} className="text-yellow-300 animate-ping" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- OBSTACLES: Deposite Buttons --- */}
      {obstacles.map(ob => (
        <div 
          key={ob.id}
          className="absolute bottom-[28%] flex flex-col items-center"
          style={{ left: `${ob.x}%` }}
        >
          <div className="bg-emerald-500 px-4 py-2 rounded-xl border-b-4 border-emerald-700 shadow-lg animate-bounce">
            <p className="text-white font-black text-xs uppercase">DEPOSIT</p>
          </div>
          <div className="mt-2 text-[10px] text-emerald-400 font-bold">ฝากเงินด่วน!</div>
        </div>
      ))}

      {/* --- UI / HUD --- */}
      <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-start pointer-events-none">
        <div className="space-y-1">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${isCrashed ? 'bg-rose-500 border-rose-400' : 'bg-emerald-500/10 border-emerald-500/50'}`}>
            {isCrashed ? <TrendingDown size={16} className="text-white" /> : <TrendingUp size={16} className="text-emerald-500" />}
            <span className={`font-black text-xs ${isCrashed ? 'text-white' : 'text-emerald-500'}`}>
              {isCrashed ? 'MARKET CRASHED!' : 'PROFIT +1000%'}
            </span>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-white/40 font-black text-[10px] uppercase">รอดจากการถูกหลอกใน...</p>
          <p className="text-white font-black text-3xl italic">{Math.ceil(timeLeft)}s</p>
        </div>
      </div>

      {/* Crash Overlay */}
      {isCrashed && (
        <div className="absolute inset-0 flex items-center justify-center bg-rose-600/20 backdrop-blur-sm z-50">
          <div className="text-center p-8 bg-black/90 border-4 border-rose-500 rounded-[3rem] shadow-2xl scale-110">
            <AlertCircle size={80} className="text-rose-500 mx-auto mb-4 animate-ping" />
            <h2 className="text-white font-black text-3xl italic mb-2">เงินหายเกลี้ยง!</h2>
            <p className="text-rose-400 font-bold uppercase tracking-tighter">กราฟหลอกเด็ก... อย่าหลงเชื่อตัวเลขปลอม!</p>
          </div>
        </div>
      )}

      {/* Floating Labels */}
      {!isCrashed && !showTutorial && (
        <div className="absolute top-1/2 right-10 opacity-30 animate-pulse pointer-events-none">
          <p className="text-white font-black text-6xl italic rotate-12">Becareful!!</p>
        </div>
      )}

      <TutorialOverlay 
        isVisible={showTutorial}
        timer={tutorialTimer}
        icon={MoveUp}
        titleTop="CRYPTO"
        titleBottom="JUMP"
        subText="แตะหน้าจอเพื่อกระโดดข้าม 'ปุ่มฝากเงิน' อย่าไปหลงกลกดเข้าล่ะ!"
      />
    </div>
  );
};

export default Level13CryptoScam;
