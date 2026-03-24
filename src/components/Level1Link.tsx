import React, { useState, useEffect } from 'react';
import { ShieldAlert, Fingerprint, MailWarning } from 'lucide-react';

interface Level1Props {
  onWin: () => void;
  onLose: () => void;
  timeLeft: number;
  onTutorialToggle?: (isShowing: boolean) => void;
}

const Level1Link: React.FC<Level1Props> = ({ onWin, onLose, timeLeft, onTutorialToggle }) => {
  const [showTutorial, setShowTutorial] = useState(true);
  const [tutorialTimer, setTutorialTimer] = useState(5);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    if (onTutorialToggle) onTutorialToggle(showTutorial);
  }, [showTutorial, onTutorialToggle]);

  useEffect(() => {
    if (showTutorial && tutorialTimer > 0) {
      const timer = setTimeout(() => setTutorialTimer(tutorialTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (tutorialTimer === 0) setShowTutorial(false);
  }, [tutorialTimer, showTutorial]);

  useEffect(() => {
    if (timeLeft <= 0 && !isClicked && !showTutorial) onWin();
  }, [timeLeft, isClicked, onWin, showTutorial]);

  const handleLinkClick = () => {
    if (showTutorial || isClicked) return;
    setIsClicked(true);
    onLose();
  };

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden">
      
      {/* --- 1. Full-Screen Tutorial (ใช้ fixed เพื่อทับทุกอย่างบนจอ) --- */}
      {showTutorial && (
        <div className="fixed inset-0 z-[999] bg-[#15173D] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
          
          {/* Grainy Texture & Glow */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
               style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />
          
          <div className="relative z-10 flex flex-col items-center">
            {/* Timer Circle */}
            <div className="w-20 h-20 border-4 border-[#E491C9] rounded-full flex items-center justify-center text-[#F1E9E9] font-black text-3xl mb-8 shadow-[0_0_30px_rgba(228,145,201,0.4)]">
              {tutorialTimer}
            </div>
            
            <Fingerprint size={100} className="text-[#E491C9] mb-8 animate-pulse" />
            
            <h2 className="text-[#F1E9E9] text-5xl font-black italic mb-4 leading-[0.9] uppercase tracking-tighter">
              DO NOT<br/><span className="text-[#E491C9]">TOUCH LINK</span>
            </h2>
            
            <p className="text-[#F1E9E9]/60 text-sm font-bold uppercase tracking-[0.2em] italic mt-4">
              ห้ามกดลิงก์แปลกปลอมเด็ดขาดจนกว่าเวลาจะหมด
            </p>
          </div>
        </div>
      )}

      {/* --- 2. Game Content Area --- */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-6 bg-[#F1E9E9]">
        
        {/* Responsive Phone Mockup */}
        <div className="w-full max-w-[320px] aspect-[9/14] bg-[#F1E9E9] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden relative border-[6px] border-white/50">
          
          <div className="p-6 pt-10 flex-1 space-y-6 flex flex-col">
            {/* Sender Info */}
            <div className="flex items-center gap-3 bg-[#15173D]/5 p-3 rounded-2xl border border-[#15173D]/5">
              <div className="w-10 h-10 bg-[#15173D] rounded-xl flex items-center justify-center text-[#E491C9] shrink-0 shadow-sm">
                <MailWarning size={22} />
              </div>
              <div className="overflow-hidden text-left">
                <p className="text-[#15173D] font-black text-[12px] uppercase truncate">หมายเลขที่ไม่รู้จัก</p>
                <p className="text-[#15173D]/40 text-[10px] font-bold italic tracking-tighter">วันนี้ 10:30</p>
              </div>
            </div>

            {/* SMS Bubble: ขยายให้เด่นขึ้น */}
            <div className="bg-gradient-to-tr from-[#982598] to-[#E491C9] p-6 rounded-[2rem] rounded-tl-none shadow-xl flex-1 flex flex-col justify-center">
              <p className="text-white text-[16px] sm:text-[18px] font-black leading-tight italic mb-6">
                พัสดุของคุณถูกระงับ!<br/>
                <span className="text-[12px] font-medium not-italic opacity-90 block mt-1">กรุณายืนยันข้อมูลด่วน:</span>
              </p>
              
              {/* Fake Link Button */}
              <div 
                onClick={handleLinkClick} 
                className="bg-[#15173D] p-4 rounded-xl border border-white/10 text-center cursor-pointer active:scale-95 transition-all shadow-lg hover:bg-[#1a1d4d]"
              >
                <span className="text-[#E491C9] text-[11px] font-mono font-black truncate block underline">
                  bank-secure.io/v/123
                </span>
              </div>
            </div>

            {/* Decor Bottom Line */}
            <div className="mt-4 flex justify-center">
              <div className="w-16 h-1.5 bg-[#15173D]/10 rounded-full" />
            </div>
          </div>
        </div>

        {/* Level Indicator */}
        <div className="flex items-center gap-2 opacity-30">
          <ShieldAlert size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest italic text-[#15173D]">
            
          </span>
        </div>
      </div>
    </div>
  );
};

export default Level1Link;