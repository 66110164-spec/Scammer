import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Smartphone, AlertCircle, Coins, Info, UserX, ShieldAlert } from 'lucide-react';
import TutorialOverlay from './TutorialOverlay';

interface Props {
  onWin: () => void;
  onLose: () => void;
  timeLeft: number;
  onTutorialToggle: (isShowing: boolean) => void;
  onRetry: () => void;
}

const Level10SimScam: React.FC<Props> = ({ onWin, onLose, timeLeft, onTutorialToggle }) => {
  const [showTutorial, setShowTutorial] = useState(true);
  const [tutorialTimer, setTutorialTimer] = useState(5);
  
  // ตำแหน่งซิมการ์ด (ผู้เล่นคุม)
  const [simPos, setSimPos] = useState({ x: 50, y: 70 });
  // ตำแหน่งมิจฉาชีพ (AI วิ่งไล่)
  const [scammerPos, setScammerPos] = useState({ x: 50, y: 20 });
  
  const isDragging = useRef(false);
  const requestRef = useRef<number>(0);

  // 1. Tutorial Logic
  useEffect(() => {
    if (onTutorialToggle) onTutorialToggle(showTutorial);
    if (showTutorial && tutorialTimer > 0) {
      const timer = setTimeout(() => setTutorialTimer(tutorialTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (tutorialTimer === 0) {
      setShowTutorial(false);
    }
  }, [tutorialTimer, showTutorial, onTutorialToggle]);

  // 2. AI & Collision Logic (มิจฉาชีพวิ่งไล่)
  useEffect(() => {
    if (showTutorial) return;

    const moveAI = () => {
      setScammerPos(prev => {
        // คำนวณทิศทางไปหาซิมการ์ด
        const dx = simPos.x - prev.x;
        const dy = simPos.y - prev.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // ความเร็วของมิจฉาชีพ (ยิ่งใกล้จบยิ่งเร็ว)
        const speed = 0.6 + (1 - (timeLeft / 10)) * 0.5;

        // เช็คการชน (Collision) - ถ้าใกล้กันเกิน 10% ของจอคือโดนจับได้
        if (distance < 12) {
          onLose();
          return prev;
        }

        return {
          x: prev.x + (dx / distance) * speed,
          y: prev.y + (dy / distance) * speed
        };
      });
      requestRef.current = requestAnimationFrame(moveAI);
    };

    requestRef.current = requestAnimationFrame(moveAI);
    return () => cancelAnimationFrame(requestRef.current);
  }, [simPos, showTutorial, timeLeft, onLose]);

  // เช็คเวลาหมด (ชนะ)
  useEffect(() => {
    if (!showTutorial && timeLeft <= 0) {
      onWin();
    }
  }, [timeLeft, onWin, showTutorial]);

  // 3. Interaction Handlers
  const handlePointerMove = (e: React.PointerEvent) => {
    if (showTutorial) return;
    
    // อัปเดตตำแหน่งซิมตามนิ้ว/เมาส์
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // จำกัดขอบเขตไม่ให้ออกนอกจอ
    setSimPos({
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(5, Math.min(95, y))
    });
  };

  return (
    <div 
      className="absolute inset-0 bg-[#0F172A] overflow-hidden font-sans select-none touch-none"
      onPointerMove={handlePointerMove}
    >
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />

      {/* --- SCAMMER (มิจฉาชีพ) --- */}
      <div 
        className="absolute transition-transform duration-75 ease-linear pointer-events-none"
        style={{ left: `${scammerPos.x}%`, top: `${scammerPos.y}%`, transform: 'translate(-50%, -50%)' }}
      >
        <div className="relative flex flex-col items-center">
          <div className="bg-rose-500 p-4 rounded-full shadow-[0_0_30px_rgba(244,63,94,0.6)] animate-pulse">
            <UserX size={48} className="text-white" />
          </div>
          <div className="mt-2 bg-white px-3 py-1 rounded-xl shadow-lg border-2 border-rose-500">
             <p className="text-rose-600 font-black text-[10px] whitespace-nowrap">เอาเงินไป 20 บาท!</p>
          </div>
          <Coins size={24} className="text-amber-400 absolute -top-4 -right-4 animate-bounce" />
        </div>
      </div>

      {/* --- PLAYER SIM CARD --- */}
      <div 
        className="absolute transition-transform duration-75 ease-out z-50 cursor-none"
        style={{ left: `${simPos.x}%`, top: `${simPos.y}%`, transform: 'translate(-50%, -50%)' }}
      >
        <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 w-16 h-10 rounded-md border-b-4 border-emerald-800 flex items-center justify-center relative shadow-[0_0_20px_rgba(16,185,129,0.4)]">
          <div className="w-8 h-6 border border-emerald-200/50 rounded-sm" />
          <div className="absolute -top-6 left-1/2 -translate-x-1/2">
             <ShieldAlert size={20} className="text-emerald-400 animate-bounce" />
          </div>
        </div>
      </div>

      {/* --- HUD --- */}
      <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center pointer-events-none">
        <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-2xl">
          <p className="text-emerald-500 font-black text-xs italic uppercase tracking-widest">อิสรภาพของคุณ</p>
        </div>
        <div className="text-right">
          <p className="text-white/40 font-black text-[10px] uppercase">รอดพ้นใน...</p>
          <p className="text-white font-black text-2xl">{Math.ceil(timeLeft)}s</p>
        </div>
      </div>

      {/* Danger Zone Warning */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center pointer-events-none">
        <div className="flex items-center gap-2 text-rose-500/50">
          <AlertCircle size={14} />
          <span className="text-[10px] font-bold uppercase tracking-tighter italic">อย่าให้มิจฉาชีพเอาเงินมาแลกซิมเราได้</span>
        </div>
      </div>

      <TutorialOverlay 
        isVisible={showTutorial}
        timer={tutorialTimer}
        icon={Smartphone}
        titleTop="DODGE"
        titleBottom="SCAM"
        subText="ใช้นิ้วลากซิมหนี 'มิจฉาชีพ' อย่าให้มันตามทันจนหมดเวลา!"
      />
    </div>
  );
};

export default Level10SimScam;