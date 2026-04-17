import React, { useState, useEffect, useRef } from 'react';
import { Wind, Skull, Briefcase, Home, AlertTriangle, ArrowRight, ArrowLeft, Heart, CheckCircle2 } from 'lucide-react';
import TutorialOverlay from './TutorialOverlay';

interface Props {
  onWin: () => void;
  onLose: () => void;
  timeLeft: number;
  onTutorialToggle: (isShowing: boolean) => void;
}

const Level8CallCenterHell: React.FC<Props> = ({ onWin, onLose, timeLeft, onTutorialToggle }) => {
  const [showTutorial, setShowTutorial] = useState(true);
  const [tutorialTimer, setTutorialTimer] = useState(5);
  
  const [position, setPosition] = useState(50);
  const [tilt, setTilt] = useState(0); 
  const [isPressingRight, setIsPressingRight] = useState(false);
  const [isPressingLeft, setIsPressingLeft] = useState(false);
  const [integrity, setIntegrity] = useState(100); 
  
  // ✅ ระบบความคืบหน้าในการเข้าเส้นชัย (ต้องไปแตะ 100 ค้างไว้)
  const [winProgress, setWinProgress] = useState(0); 

  const velocityRef = useRef(0); 
  const requestRef = useRef<number>(0);

  useEffect(() => {
    if (onTutorialToggle) onTutorialToggle(showTutorial);
    if (showTutorial && tutorialTimer > 0) {
      const timer = setTimeout(() => setTutorialTimer(tutorialTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (tutorialTimer === 0) setShowTutorial(false);
  }, [tutorialTimer, showTutorial, onTutorialToggle]);

  // --- PHYSICS ENGINE ---
  useEffect(() => {
    if (showTutorial) return;

    const updatePhysics = () => {
      const windForce = -0.22; // ลมพัดแรงสม่ำเสมอ
      let playerForce = tilt * 0.5; 
      if (isPressingRight) playerForce = 0.65; 
      if (isPressingLeft) playerForce = -0.65;

      velocityRef.current += (windForce + playerForce);
      velocityRef.current *= 0.88; 

      setPosition(prev => {
        let nextPos = prev + velocityRef.current;
        if (nextPos < 0) nextPos = 0;
        if (nextPos > 100) nextPos = 100;

        // ❌ ระบบแพ้: อยู่โซนอันตราย (ซ้ายสุด)
        if (nextPos < 10) {
          setIntegrity(p => {
            if (p <= 0) { onLose(); return 0; }
            return p - 1.2;
          });
        } else {
          setIntegrity(p => Math.min(100, p + 0.5));
        }

        // ✅ ระบบชนะ: ต้องไปให้สุดขอบขวา (95-100%)
        if (nextPos > 95) {
          setWinProgress(p => {
            if (p >= 100) { onWin(); return 100; }
            return p + 2; // ต้องยืนระยะฝั่งขวาซักพักถึงจะชนะ
          });
        } else {
          setWinProgress(p => Math.max(0, p - 5)); // ถ้าปลิดออกจากขอบขวา Progress ชนะจะลดฮวบ
        }

        return nextPos;
      });

      requestRef.current = requestAnimationFrame(updatePhysics);
    };

    requestRef.current = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(requestRef.current);
  }, [tilt, isPressingRight, isPressingLeft, showTutorial, onWin, onLose]);

  // --- INPUT SENSORS (Hybrid Support) ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIsPressingRight(true);
      if (e.key === "ArrowLeft") setIsPressingLeft(true);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIsPressingRight(false);
      if (e.key === "ArrowLeft") setIsPressingLeft(false);
    };
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null) setTilt(Math.max(-1, Math.min(1, e.gamma / 25)));
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("deviceorientation", handleOrientation);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  return (
    <div className={`absolute inset-0 transition-colors duration-500 overflow-hidden font-sans select-none touch-none
      ${position < 15 ? 'bg-rose-950' : position > 85 ? 'bg-emerald-950' : 'bg-[#0F172A]'}`}>
      
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:30px_30px]" />

      {/* --- CHARACTER --- */}
      <div 
        className="absolute bottom-[40%] transition-all duration-75"
        style={{ left: `${position}%`, transform: `translateX(-50%)` }}
      >
        <div className="relative">
          <div className={`p-7 rounded-[2rem] border-b-[10px] shadow-2xl transition-all duration-300
            ${position < 15 ? 'bg-rose-500 border-rose-800 animate-shake' : position > 90 ? 'bg-emerald-400 border-emerald-700 animate-bounce' : 'bg-amber-400 border-amber-600'}`}
            style={{ transform: `rotate(${velocityRef.current * 12}deg)` }}
          >
            <Briefcase size={50} className="text-slate-900" />
            
            {position < 15 && (
              <AlertTriangle size={30} className="absolute -top-12 left-1/2 -translate-x-1/2 text-rose-500 animate-ping" />
            )}
          </div>
        </div>
      </div>

      {/* --- HUD: STATUS BARS --- */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-full max-w-xs px-6 space-y-4">
        {/* Integrity (Left Side Danger) */}
        <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 mb-1 text-[10px] font-black uppercase text-rose-400">
                <Skull size={12} /> ความอดทนต่อกิเลส
            </div>
            <div className="h-2 w-full bg-black/40 rounded-full border border-white/5 overflow-hidden">
                <div className="h-full bg-rose-500 transition-all" style={{ width: `${integrity}%` }} />
            </div>
        </div>

        {/* Win Progress (Right Side Goal) */}
        <div className="flex flex-col items-center">
            <div className={`flex items-center gap-1 mb-1 text-[10px] font-black uppercase transition-colors ${winProgress > 0 ? 'text-emerald-400' : 'text-white/20'}`}>
                <CheckCircle2 size={12} /> เข้าสู่ทางสุจริต
            </div>
            <div className="h-2 w-full bg-black/40 rounded-full border border-white/5 overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all shadow-[0_0_10px_#10b981]" style={{ width: `${winProgress}%` }} />
            </div>
        </div>
      </div>

      {/* --- VISUAL GOALS --- */}
      <div className="absolute inset-y-0 left-0 w-8 bg-rose-600/20 border-r border-rose-500/40 flex items-center justify-center">
          <p className="[writing-mode:vertical-lr] text-rose-500 font-black text-xs uppercase tracking-widest opacity-40">DANGER ZONE</p>
      </div>
      <div className="absolute inset-y-0 right-0 w-8 bg-emerald-600/20 border-l border-emerald-500/40 flex items-center justify-center">
          <p className="[writing-mode:vertical-lr] text-emerald-500 font-black text-xs uppercase tracking-widest opacity-40 rotate-180">GOAL ZONE</p>
      </div>

      {/* --- CONTROLS --- */}
      <div className="absolute bottom-12 left-0 right-0 flex justify-between px-8 z-50">
        <button 
          onPointerDown={() => setIsPressingLeft(true)} onPointerUp={() => setIsPressingLeft(false)}
          className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center border-2 border-white/10 active:bg-rose-500/20 transition-all"
        >
          <ArrowLeft size={40} className="text-white/20" />
        </button>

        <button 
          onPointerDown={() => setIsPressingRight(true)} onPointerUp={() => setIsPressingRight(false)}
          className="w-32 h-32 bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center border-4 border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.2)] animate-pulse active:bg-emerald-500 active:scale-95 transition-all"
        >
          <ArrowRight size={60} className="text-emerald-500 active:text-white" />
        </button>
      </div>

      <div className="absolute top-8 left-8 bg-amber-500 px-4 py-1 rounded-full text-black font-black text-xs italic shadow-lg">
        LVL 8: THE BALANCE OF CHOICE
      </div>

      <TutorialOverlay 
        isVisible={showTutorial} timer={tutorialTimer} icon={Wind} titleTop="KEEP" titleBottom="RIGHT"
        subText="กดปุ่ม 'ขวา' หรือเอียงเครื่องไปทางขวา ค้างไว้ให้สุดขอบเพื่อเข้าสู่ทางรอด!" 
      />
    </div>
  );
};

export default Level8CallCenterHell;