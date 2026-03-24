import React, { useState, useEffect, useMemo } from 'react';
import { Phone, PhoneOff, ShieldAlert, PhoneIncoming, Fingerprint } from 'lucide-react';

interface Level3Props {
  onWin: () => void;
  onLose: () => void;
  timeLeft: number;
  onTutorialToggle?: (isShowing: boolean) => void;
}

interface Caller {
  id: number;
  name: string;
  number: string;
  isSafe: boolean;
}

const ALL_CALLERS: Caller[] = [
  { id: 1, name: "แม่", number: "081-XXX-XXXX", isSafe: true },
  { id: 2, name: "เบอร์แปลก", number: "ไม่แสดงหมายเลข", isSafe: false },
  { id: 3, name: "สรรพากร", number: "094-XXX-XXXX", isSafe: false },
  { id: 4, name: "ไอ้ป้อม เพื่อนรัก", number: "099-XXX-XXXX", isSafe: true },
  { id: 5, name: "ธนาคาร", number: "080-XXX-XXXX", isSafe: false },
  { id: 6, name: "ป้าข้างบ้าน", number: "061-XXX-XXXX", isSafe: true },
  { id: 7, name: "ตำรวจไซเบอร์", number: "086-XXX-XXXX", isSafe: false },
];

const Level3Call: React.FC<Level3Props> = ({ onWin, onLose, timeLeft, onTutorialToggle }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);
  const [tutorialTimer, setTutorialTimer] = useState(5);
  
  const TOTAL_CALLS = 3;

  const sequence = useMemo(() => {
    return [...ALL_CALLERS]
      .sort(() => Math.random() - 0.5)
      .slice(0, TOTAL_CALLS);
  }, []);

  const currentCaller = sequence[currentIdx];

  // แจ้ง App ว่ากำลังอยู่ในหน้า Tutorial เพื่อหยุดเวลา
  useEffect(() => {
    if (onTutorialToggle) onTutorialToggle(true);
  }, [onTutorialToggle]);

  // ระบบนับถอยหลัง Tutorial
  useEffect(() => {
    if (showTutorial && tutorialTimer > 0) {
      const timer = setTimeout(() => setTutorialTimer(tutorialTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (showTutorial && tutorialTimer === 0) {
      setShowTutorial(false);
      if (onTutorialToggle) onTutorialToggle(false); // เริ่มเดินเวลาหลัก
    }
  }, [tutorialTimer, showTutorial, onTutorialToggle]);

  const handleDecision = (choice: 'accept' | 'decline') => {
    if (showTutorial) return;

    const isCorrect = (choice === 'accept' && currentCaller.isSafe) || 
                      (choice === 'decline' && !currentCaller.isSafe);

    if (isCorrect) {
      if (currentIdx + 1 >= TOTAL_CALLS) {
        onWin();
      } else {
        setCurrentIdx(prev => prev + 1);
      }
    } else {
      onLose();
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#15173D] relative overflow-hidden">
      
      {/* --- 1. Tutorial Overlay (Fixed ทับทั้งหน้าจอ) --- */}
      {showTutorial && (
        <div className="fixed inset-0 z-[999] bg-[#15173D] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
          
          {/* Grainy Texture & Effect */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
               style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />
          
          <div className="relative z-10 flex flex-col items-center">
            {/* Timer Circle */}
            <div className="w-20 h-20 border-4 border-[#E491C9] rounded-full flex items-center justify-center text-white font-black text-3xl mb-8 shadow-[0_0_30px_rgba(228,145,201,0.4)]">
              {tutorialTimer}
            </div>
            
            <div className="mb-8 text-[#E491C9] animate-bounce">
              <Fingerprint size={100} strokeWidth={1.5} />
            </div>
            
            <h2 className="text-white text-5xl font-black mb-4 italic tracking-tighter uppercase leading-[0.9]">
              READY TO<br/><span className="text-[#E491C9]">ANSWER?</span>
            </h2>
            
            <p className="text-white/80 text-lg font-medium leading-relaxed max-w-xs mt-4">
              เลือกรับสาย <span className="text-[#E491C9] font-bold underline">หรือวางสาย</span> ให้ถูกต้อง<br/>
              พิจารณาชื่อและเบอร์โทรให้ดี!
            </p>
          </div>
        </div>
      )}

      {/* --- 2. Main Game Content --- */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6">
        
        {/* Progress Dots */}
        <div className="flex space-x-3 mb-4">
          {[...Array(TOTAL_CALLS)].map((_, i) => (
            <div 
              key={i} 
              className={`h-3 rounded-full transition-all duration-500 ${
                i < currentIdx ? 'w-8 bg-green-400' : i === currentIdx ? 'w-12 bg-[#E491C9] animate-pulse' : 'w-3 bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Caller Card */}
        <div className="w-full max-w-[320px] bg-white rounded-[3rem] p-8 shadow-2xl flex flex-col items-center text-center space-y-6 relative overflow-hidden border-[6px] border-white/50">
          <div className="absolute top-0 w-full h-20 bg-[#F1E9E9]/50 -z-0" />
          
          <div className="z-10 bg-[#15173D] p-5 rounded-[2rem] text-[#E491C9] shadow-xl animate-bounce">
            <PhoneIncoming size={48} />
          </div>
          
          <div className="z-10 space-y-2 min-h-[100px] flex flex-col justify-center">
            <h3 className="text-3xl font-black text-[#15173D] tracking-tighter uppercase italic leading-none truncate w-full">
              {currentCaller.name}
            </h3>
            <p className="text-[#982598] font-black text-xl tracking-wider">{currentCaller.number}</p>
          </div>
          
          <div className="z-10 flex flex-col items-center">
            <div className="flex gap-1 mb-2">
               {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 bg-[#15173D]/20 rounded-full animate-pulse" style={{animationDelay: `${i*0.2}s`}}/>)}
            </div>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em]">Incoming Call</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex w-full max-w-[320px] gap-4 pt-4">
          <button 
            onClick={() => handleDecision('decline')}
            className="flex-1 bg-gradient-to-b from-red-500 to-red-600 p-6 rounded-[2.5rem] border-b-8 border-red-800 text-white flex flex-col items-center gap-2 active:translate-y-1 active:border-b-4 transition-all"
          >
            <PhoneOff size={32} strokeWidth={2.5} />
            <span className="font-black text-xs uppercase tracking-widest">Decline</span>
          </button>
          
          <button 
            onClick={() => handleDecision('accept')}
            className="flex-1 bg-gradient-to-b from-green-500 to-green-600 p-6 rounded-[2.5rem] border-b-8 border-green-800 text-white flex flex-col items-center gap-2 active:translate-y-1 active:border-b-4 transition-all"
          >
            <Phone size={32} strokeWidth={2.5} />
            <span className="font-black text-xs uppercase tracking-widest">Accept</span>
          </button>
        </div>

        {/* Instruction Footer */}
        <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-full flex items-center space-x-3 backdrop-blur-md">
           <ShieldAlert size={18} className="text-[#E491C9]" />
           <span className="text-white/70 font-bold text-[10px] uppercase tracking-widest leading-none">
           </span>
        </div>
      </div>
    </div>
  );
};

export default Level3Call;