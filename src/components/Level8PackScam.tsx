import React, { useState, useEffect } from 'react';
import { Package, ShieldCheck, AlertCircle, ArrowUp, Info, ShieldAlert } from 'lucide-react';
import TutorialOverlay from './TutorialOverlay';

interface Props {
  onWin: () => void;
  onLose: () => void;
  timeLeft: number;
  onTutorialToggle: (isShowing: boolean) => void;
}

interface Item {
  id: number;
  isSafe: boolean; // true = กล่องฟรี, false = กล่องเรียกมัดจำ
  x: number;
  isProcessed: boolean;
}

const Level8PackScam: React.FC<Props> = ({ onWin, onLose, timeLeft, onTutorialToggle }) => {
  const [showTutorial, setShowTutorial] = useState(true);
  const [tutorialTimer, setTutorialTimer] = useState(5);
  const [items, setItems] = useState<Item[]>([]);
  const [score, setScore] = useState(0);
  const targetScore = 3; // จำนวนกล่องที่ต้องเก็บให้ครบ

  // --- 1. TUTORIAL & TIMER ---
  useEffect(() => {
    if (onTutorialToggle) onTutorialToggle(showTutorial);
    if (showTutorial && tutorialTimer > 0) {
      const timer = setTimeout(() => setTutorialTimer(tutorialTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (tutorialTimer === 0) setShowTutorial(false);
  }, [tutorialTimer, showTutorial, onTutorialToggle]);

  useEffect(() => {
    if (!showTutorial && timeLeft <= 0) onLose();
  }, [timeLeft, onLose, showTutorial]);

  // --- 2. CONVEYOR LOGIC ---
  useEffect(() => {
    if (showTutorial) return;

    // สุ่มปล่อยกล่อง
    const spawnInterval = setInterval(() => {
      setItems(prev => [
        ...prev,
        { 
          id: Date.now(), 
          isSafe: Math.random() > 0.4, // โอกาสเป็นกล่องปลอดภัย 60%
          x: -15, 
          isProcessed: false 
        }
      ]);
    }, 1200);

    // เคลื่อนที่กล่อง
    const moveInterval = setInterval(() => {
      setItems(prev => {
        const next = prev.map(item => ({ ...item, x: item.x + 1.5 }));
        
        // ถ้ากล่องปลอดภัย (isSafe) หลุดขอบโดยไม่ได้กด = แพ้
        if (next.some(item => item.x > 105 && item.isSafe && !item.isProcessed)) {
          onLose();
        }
        return next.filter(item => item.x <= 110);
      });
    }, 20);

    return () => { clearInterval(spawnInterval); clearInterval(moveInterval); };
  }, [showTutorial, onLose]);

  // --- 3. INTERACTION HANDLERS ---
  const handleItemClick = (id: number, isSafe: boolean) => {
    if (showTutorial) return;

    if (!isSafe) {
      // กดโดนกล่องมัดจำ = แพ้ทันที
      onLose();
    } else {
      // กดโดนกล่องปลอดภัย = ได้คะแนน
      setScore(prev => {
        const next = prev + 1;
        if (next >= targetScore) setTimeout(onWin, 300);
        return next;
      });
      // ทำเครื่องหมายว่าถูกจัดการแล้ว (เพื่อให้หายไปจากจอ)
      setItems(prev => prev.map(item => item.id === id ? { ...item, isProcessed: true } : item));
    }
  };

  return (
    <div className="absolute inset-0 bg-[#0F172A] overflow-hidden flex flex-col font-sans select-none">
      
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
        <Package size={300} className="text-white" />
      </div>

      {/* --- Top UI: Warning Header --- */}
      <div className="relative z-10 p-8 text-center mt-10">
        <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/50 px-4 py-2 rounded-2xl">
          <AlertCircle size={18} className="text-amber-500 animate-pulse" />
          <span className="text-amber-500 font-black italic text-xs uppercase tracking-wider">
            คัดแยกเฉพาะกล่องที่ไม่เสียค่ามัดจำ
          </span>
        </div>
      </div>

      {/* --- Middle: Conveyor Belt (สายพาน) --- */}
      <div className="relative h-64 mt-10">
        {/* Belt Line */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-32 bg-slate-800 border-y-4 border-slate-700 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[length:50px_50px]" 
               style={{ backgroundImage: 'linear-gradient(90deg, #fff 2px, transparent 2px)' }} />
        </div>

        {/* Moving Items */}
        {items.map(item => (
          !item.isProcessed && (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id, item.isSafe)}
              style={{ left: `${item.x}%`, top: '50%', transform: 'translate(-50%, -50%)' }}
              className={`absolute p-4 rounded-3xl shadow-2xl border-b-8 transition-transform active:scale-90
                ${item.isSafe 
                  ? "bg-white border-slate-300 text-slate-900" 
                  : "bg-rose-500 border-rose-700 text-white animate-bounce"
                }`}
            >
              <div className="flex flex-col items-center gap-1 w-24">
                {item.isSafe ? <ShieldCheck size={28} className="text-green-500" /> : <AlertCircle size={28} />}
                <p className="font-black italic text-[10px] uppercase leading-tight">
                  {item.isSafe ? "Free Job" : "Pay Deposit"}
                </p>
                <p className="font-bold text-[8px] opacity-60 uppercase">
                  {item.isSafe ? "ไม่ต้องมัดจำ" : "มัดจำ 500.-"}
                </p>
              </div>
            </button>
          )
        ))}
      </div>

      {/* --- Bottom UI: Progress Bar --- */}
      <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-black to-transparent">
        <div className="flex justify-between items-end mb-3">
          <div className="flex items-center gap-2 text-white/40">
            <ShieldAlert size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Quality Control</span>
          </div>
          <p className="text-white font-black text-3xl italic">
            {score}<span className="text-amber-500">/{targetScore}</span>
          </p>
        </div>
        <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden border border-white/5">
          <div 
            className="h-full bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all duration-300" 
            style={{ width: `${(score / targetScore) * 100}%` }} 
          />
        </div>
      </div>

      {/* --- Top Info Bar --- */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20 pointer-events-none">
        <button className="p-2 bg-white/5 rounded-full text-white pointer-events-auto">
          <Info size={24} />
        </button>
        <div className="bg-amber-500 px-4 py-1.5 rounded-full text-black font-black text-[10px] italic">
          LEVEL 8: CARGO TRAP
        </div>
      </div>

      <TutorialOverlay 
        isVisible={showTutorial}
        timer={tutorialTimer}
        icon={Package}
        titleTop="CARGO"
        titleBottom="SCAM"
        subText="กดเฉพาะกล่อง 'Free Job' ที่ไม่ต้องมัดจำ ห้ามกดกล่องที่เรียกเงินเด็ดขาด!"
      />
    </div>
  );
};

export default Level8PackScam;