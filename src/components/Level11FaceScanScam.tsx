import React, { useState, useEffect, useRef } from 'react';
import { Scan, ShieldCheck, User, Camera, Sparkles, Hand, ShieldAlert, Smartphone } from 'lucide-react';
import TutorialOverlay from './TutorialOverlay';

interface Props {
  onWin: () => void;
  onLose: () => void;
  timeLeft: number;
  onTutorialToggle: (isShowing: boolean) => void;
  onRetry: () => void;
}

const Level10FaceScanScam: React.FC<Props> = ({ onWin, onLose, timeLeft, onTutorialToggle }) => {
  const [showTutorial, setShowTutorial] = useState(true);
  const [tutorialTimer, setTutorialTimer] = useState(5);
  
  // ใช้ useRef สำหรับตำแหน่งเพื่อให้เคลื่อนที่ได้ลื่นไหล ไม่ต้องรอ Re-render ของ State ในทุก Frame
  const cameraRef = useRef({ x: 50, y: 50 });
  const [displayCameraPos, setDisplayCameraPos] = useState({ x: 50, y: 50 });
  const [blockPos, setBlockPos] = useState({ x: 50, y: 50 });
  
  const [scanProgress, setScanProgress] = useState(0);
  const [isBlocking, setIsBlocking] = useState(false);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    if (onTutorialToggle) onTutorialToggle(showTutorial);
    if (showTutorial && tutorialTimer > 0) {
      const timer = setTimeout(() => setTutorialTimer(tutorialTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (tutorialTimer === 0) setShowTutorial(false);
  }, [tutorialTimer, showTutorial]);

  useEffect(() => {
    if (showTutorial) return;

    let angle = 0;
    const updateGame = () => {
      // ✅ คำนวณตำแหน่งเป้าหมาย (Target)
      angle += 0.012; 
      const targetX = 50 + Math.sin(angle) * 32;
      const targetY = 45 + Math.cos(angle * 0.5) * 12;

      // ✅ ใช้ระบบ Smooth Follow (ลดอาการกระตุก)
      cameraRef.current.x += (targetX - cameraRef.current.x) * 0.1;
      cameraRef.current.y += (targetY - cameraRef.current.y) * 0.1;
      
      setDisplayCameraPos({ x: cameraRef.current.x, y: cameraRef.current.y });

      const dx = cameraRef.current.x - blockPos.x;
      const dy = cameraRef.current.y - blockPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const blocking = distance <= 18;
      setIsBlocking(blocking);

      if (!blocking) {
        setScanProgress(prev => {
          const next = prev + 0.15;
          if (next >= 100) onLose();
          return next;
        });
      } else {
        setScanProgress(prev => Math.max(0, prev - 0.2));
      }
      
      requestRef.current = requestAnimationFrame(updateGame);
    };

    requestRef.current = requestAnimationFrame(updateGame);
    return () => cancelAnimationFrame(requestRef.current);
  }, [blockPos, showTutorial, onLose]);

  useEffect(() => {
    if (!showTutorial && timeLeft <= 0) onWin();
  }, [timeLeft, onWin, showTutorial]);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (showTutorial) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setBlockPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    });
  };

  return (
    <div 
      className="absolute inset-0 bg-[#0F172A] overflow-hidden font-sans select-none touch-none"
      onPointerMove={handlePointerMove}
    >
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#475569_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* --- Character Art --- */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-10">
        <div className="relative flex flex-col items-center">
            <div className="w-56 h-64 bg-slate-800 rounded-[100px] border-8 border-slate-700 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
                <div className="w-44 h-52 bg-[#FFDBAC] rounded-[80px] flex flex-col items-center justify-center p-6 border-4 border-[#F1C27D]">
                    <div className="flex gap-10 mb-6">
                        <div className="w-5 h-5 bg-slate-900 rounded-full" />
                        <div className="w-5 h-5 bg-slate-900 rounded-full" />
                    </div>
                    <div className="w-14 h-2 bg-slate-900/20 rounded-full mb-4" />
                    <div className="w-20 h-4 border-b-4 border-slate-900 rounded-full" />
                </div>
            </div>
            <div className="w-40 h-16 bg-blue-600 -mt-6 rounded-t-3xl border-t-4 border-blue-500" />
        </div>
      </div>

      {/* --- Scammer's Camera (เอา CSS transition ออกเพื่อความลื่น) --- */}
      <div 
        className="absolute pointer-events-none"
        style={{ 
            left: `${displayCameraPos.x}%`, 
            top: `${displayCameraPos.y}%`, 
            transform: 'translate(-50%, -50%)',
            willChange: 'left, top' // ช่วยให้ Browser optimize การขยับ
        }}
      >
        <div className={`relative border-4 rounded-3xl p-12 ${isBlocking ? 'border-emerald-500/30' : 'border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)]'}`}>
          <Scan size={100} className={isBlocking ? 'text-emerald-500/40' : 'text-rose-500'} />
        </div>
      </div>

      {/* --- Player's Block (โล่ติดนิ้วแบบ Real-time) --- */}
      <div 
        className="absolute z-50 pointer-events-none"
        style={{ 
          left: `${blockPos.x}%`, 
          top: `${blockPos.y}%`, 
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className={`p-10 rounded-full shadow-2xl backdrop-blur-md border-4 transition-transform duration-75
          ${isBlocking ? 'bg-emerald-500 border-emerald-300 scale-110' : 'bg-emerald-500/40 border-emerald-400/50 scale-100'}`}>
          <ShieldCheck size={60} className="text-white drop-shadow-lg" />
          {isBlocking && (
            <div className="absolute inset-0 rounded-full border-4 border-white animate-ping opacity-20" />
          )}
        </div>
      </div>

      {/* --- HUD --- */}
      <div className="absolute bottom-10 left-0 right-0 px-12 z-20">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert size={18} className="text-emerald-400" />
            <span className="text-white font-black italic text-sm tracking-widest uppercase">Privacy Shield</span>
          </div>
          <span className={`font-black text-xl ${scanProgress > 70 ? 'text-rose-500 animate-pulse' : 'text-emerald-400'}`}>
            {Math.floor(scanProgress)}%
          </span>
        </div>
        <div className="h-4 w-full bg-slate-800 rounded-full p-1 border border-slate-700">
          <div 
            className={`h-full rounded-full transition-all duration-150 ${scanProgress > 70 ? 'bg-rose-600' : 'bg-emerald-500'}`}
            style={{ width: `${scanProgress}%` }}
          />
        </div>
      </div>

      {/* Top Banner */}
      <div className="absolute top-8 left-0 right-0 px-8 flex justify-between items-center pointer-events-none">
        <div className="bg-white px-5 py-2 rounded-2xl shadow-xl flex items-center gap-3 border-b-4 border-slate-200 animate-bounce">
          <Smartphone size={20} className="text-blue-600" />
          <p className="text-slate-900 font-black text-xs italic uppercase italic tracking-tighter">"รับซิมฟรี แค่สแกนหน้า!"</p>
        </div>
        <div className="bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
          <p className="text-white font-black text-2xl tracking-tighter">{Math.ceil(timeLeft)}<span className="text-[10px] text-emerald-400 ml-1 font-bold tracking-normal">S</span></p>
        </div>
      </div>

      <TutorialOverlay 
        isVisible={showTutorial}
        timer={tutorialTimer}
        icon={Hand}
        titleTop="FACE"
        titleBottom="SAFE"
        subText="ลาก 'โล่สีเขียว' ไปทับกล้องมิจฉาชีพเพื่อบล็อกการสแกนใบหน้า!"
      />
    </div>
  );
};

export default Level10FaceScanScam;