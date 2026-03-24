import React, { useState, useEffect } from 'react';
import { ShieldAlert, Fingerprint, MessageSquareWarning, UserX, UserCheck } from 'lucide-react';

interface Level4Props {
  onWin: () => void;
  onLose: () => void;
  timeLeft: number;
  onTutorialToggle?: (isShowing: boolean) => void;
}

const Level4Meeting: React.FC<Level4Props> = ({ onWin, onLose, timeLeft, onTutorialToggle }) => {
  const [showTutorial, setShowTutorial] = useState(true);
  const [tutorialTimer, setTutorialTimer] = useState(5);
  const [isDecided, setIsDecided] = useState(false);

  useEffect(() => {
    if (onTutorialToggle) onTutorialToggle(showTutorial);
  }, [showTutorial, onTutorialToggle]);

  useEffect(() => {
    if (showTutorial && tutorialTimer > 0) {
      const timer = setTimeout(() => setTutorialTimer(tutorialTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (tutorialTimer === 0) setShowTutorial(false);
  }, [tutorialTimer, showTutorial]);

  // Logic: ด่านนี้ต้อง "ปฏิเสธ" (ไม่ไป) ถึงจะชนะ
  const handleDecision = (go: boolean) => {
    if (showTutorial || isDecided) return;
    setIsDecided(true);
    
    if (!go) {
      onWin(); // ปฏิเสธคนแปลกหน้า = ชนะ
    } else {
      onLose(); // ไปหาคนแปลกหน้า = แพ้
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden bg-[#F1E9E9]">
      
      {/* --- 1. Full-Screen Tutorial (สไตล์เดียวกับด่าน 1) --- */}
      {showTutorial && (
        <div className="fixed inset-0 z-[999] bg-[#15173D] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
               style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 border-4 border-[#E491C9] rounded-full flex items-center justify-center text-[#F1E9E9] font-black text-3xl mb-8 shadow-[0_0_20px_rgba(228,145,201,0.5)]">
              {tutorialTimer}
            </div>
            <Fingerprint size={100} className="text-[#E491C9] mb-8" />
            <h2 className="text-[#F1E9E9] text-5xl font-black italic mb-4 leading-[0.9] uppercase tracking-tighter">
              STRANGER<br/><span className="text-[#E491C9]">DANGER</span>
            </h2>
            <p className="text-[#F1E9E9]/50 text-xs font-bold uppercase tracking-widest italic mt-4">อย่าหลงเชื่อคำชวนจากคนในโซเชียล</p>
          </div>
        </div>
      )}

      {/* --- 2. Game Content Layout (คล้ายด่าน 1) --- */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-6">
        
        {/* Phone Mockup */}
        <div className="w-full max-w-[320px] aspect-[9/15] bg-white rounded-[3rem] shadow-2xl flex flex-col overflow-hidden relative border-[6px] border-white/50">
          
          {/* Status Bar Decor */}
          <div className="h-8 w-full bg-[#15173D]/5 flex items-center justify-center">
             <div className="w-12 h-4 bg-[#15173D]/10 rounded-full" />
          </div>

          <div className="p-6 flex-1 space-y-6 flex flex-col">
            {/* Stranger Profile */}
            <div className="flex items-center gap-3 bg-[#15173D]/5 p-3 rounded-2xl border border-[#15173D]/5">
              <div className="w-12 h-12 bg-[#15173D] rounded-full flex items-center justify-center text-[#E491C9] shrink-0 border-2 border-[#E491C9]/20">
                <MessageSquareWarning size={24} />
              </div>
              <div className="overflow-hidden">
                <p className="text-[#15173D] font-black text-[14px] uppercase truncate leading-none">Unknown_User99</p>
                <p className="text-green-500 text-[10px] font-bold animate-pulse mt-1">● Online</p>
              </div>
            </div>

            {/* Chat Bubble (Style ด่าน 1) */}
            <div className="bg-gradient-to-tr from-[#982598] to-[#E491C9] p-5 rounded-[2rem] rounded-tl-none shadow-lg relative">
              <p className="text-white text-[15px] font-bold leading-relaxed italic">
                "หวัดดีครับ เห็นโปรไฟล์คุณน่ารักดี พอดีผมมีงานถ่ายแบบรายได้ดีมากสนใจไหม? <br/>
                <span className="text-[12px] opacity-90 block mt-2 font-medium not-italic">เย็นนี้มาเจอกันที่สวนสาธารณะลับหลังห้าง... นะครับ"</span>
              </p>
              {/* ตกแต่งหาง Chat */}
              <div className="absolute top-0 -left-2 w-4 h-4 bg-[#982598] clip-path-triangle" />
            </div>

            <div className="flex-1 flex flex-col justify-end space-y-3 pb-4">
              {/* Option: Go (Lose) */}
              <button 
                onClick={() => handleDecision(true)}
                className="w-full py-4 bg-[#15173D]/5 border-2 border-[#15173D]/10 rounded-2xl flex items-center justify-center gap-3 group active:scale-95 transition-all"
              >
                <UserCheck size={20} className="text-gray-400 group-hover:text-green-500" />
                <span className="text-[#15173D]/40 font-black text-sm uppercase italic">สนใจค่ะ/ครับ เดี๋ยวไปหา</span>
              </button>

              {/* Option: Refuse (Win) */}
              <button 
                onClick={() => handleDecision(false)}
                className="w-full py-4 bg-[#15173D] rounded-2xl flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all"
              >
                <UserX size={20} className="text-[#E491C9]" />
                <span className="text-white font-black text-sm uppercase italic">ไม่สนใจและบล็อกถาวร</span>
              </button>
            </div>
          </div>

          {/* Bottom Bar Decor */}
          <div className="h-10 bg-white/20 border-t border-black/5 flex items-center justify-center">
            <div className="w-20 h-1 bg-[#15173D]/10 rounded-full" />
          </div>
        </div>

        {/* Level Indicator */}
        <div className="flex items-center gap-2 opacity-30">
          <ShieldAlert size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest italic text-[#15173D]">
            Level 4: Stranger Meeting
          </span>
        </div>
      </div>
    </div>
  );
};

export default Level4Meeting;