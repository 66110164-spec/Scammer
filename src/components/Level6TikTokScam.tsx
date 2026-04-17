import React, { useState, useEffect, useCallback } from 'react';
import { Heart, Zap, DollarSign, ShieldAlert, Info, PlayCircle } from 'lucide-react';
import TutorialOverlay from './TutorialOverlay';

interface Props {
  onWin: () => void;
  onLose: () => void;
  timeLeft: number;
  onTutorialToggle: (isShowing: boolean) => void;
}

const Level6TikTokScam: React.FC<Props> = ({ onWin, onLose, timeLeft, onTutorialToggle }) => {
  // --- PART 1: STATES ---
  const [showTutorial, setShowTutorial] = useState(true);
  const [tutorialTimer, setTutorialTimer] = useState(5);
  const [likeCount, setLikeCount] = useState(0);
  const [showScamPopUp, setShowScamPopUp] = useState(false);
  const targetLikes = 30; // จำนวนไลค์ที่ต้องกดให้ถึง

  // --- PART 2: TUTORIAL LOGIC ---
  useEffect(() => {
    if (onTutorialToggle) onTutorialToggle(showTutorial);
    if (showTutorial && tutorialTimer > 0) {
      const timer = setTimeout(() => setTutorialTimer(tutorialTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (tutorialTimer === 0) {
      setShowTutorial(false);
    }
  }, [tutorialTimer, showTutorial, onTutorialToggle]);

  // --- PART 3: SCAM POP-UP LOGIC (ตัวขวางหน้าจอ) ---
  useEffect(() => {
    if (showTutorial) return;

    // สุ่มเด้งปุ่มเติมเงินทุกๆ 1.5 - 3 วินาที
    const triggerPopUp = () => {
      if (Math.random() > 0.4) {
        setShowScamPopUp(true);
        // ให้ปุ่มค้างไว้ 1.2 วินาทีแล้วหายไปเองถ้าไม่เผลอไปกด
        setTimeout(() => setShowScamPopUp(false), 1200);
      }
    };

    const interval = setInterval(triggerPopUp, 2000);
    return () => clearInterval(interval);
  }, [showTutorial]);

  // เช็คเวลาหมด
  useEffect(() => {
    if (!showTutorial && timeLeft <= 0) onLose();
  }, [timeLeft, onLose, showTutorial]);

  // --- PART 4: HANDLERS ---
  const handleLike = () => {
    if (showTutorial || showScamPopUp) return;
    const nextCount = likeCount + 1;
    setLikeCount(nextCount);
    if (nextCount >= targetLikes) {
      setTimeout(() => onWin(), 200);
    }
  };

  const handleScamClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // กันไม่ให้ไปโดนปุ่ม Like ด้านล่าง
    onLose(); // เผลอกดเติมเงิน = แพ้ทันที
  };

  return (
    <div className="absolute inset-0 bg-black overflow-hidden flex flex-col font-sans select-none">
      
      {/* --- Layer 1: Fake TikTok Video Background --- */}
      <div className="absolute inset-0 flex items-center justify-center opacity-40">
        <div className="w-full h-full bg-gradient-to-b from-gray-900 via-black to-gray-900 flex flex-col items-center justify-center">
            <PlayCircle size={80} className="text-white/20 animate-pulse" />
            <p className="text-white/20 font-black mt-4 italic uppercase tracking-[0.3em]">Fake Content Loading...</p>
        </div>
      </div>

      {/* --- Layer 2: VIP Energy Bar (แถบส้มด้านบน) --- */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[80%] z-10">
        <div className="flex justify-between mb-1 items-center">
            <div className="flex items-center gap-1 text-[#F59E0B]">
                <Zap size={14} fill="#F59E0B" />
                <span className="text-[10px] font-black italic uppercase">VIP ENERGY</span>
            </div>
            <span className="text-[10px] text-white/50 font-bold tracking-tighter">LOW CAPACITY</span>
        </div>
        <div className="h-3 w-full bg-white/10 rounded-full border border-white/10 overflow-hidden">
            <div 
              className="h-full bg-[#F59E0B] animate-pulse" 
              style={{ width: '15%' }} // แกล้งทำเป็นเหลือน้อย
            />
        </div>
      </div>

      {/* --- Layer 3: Main Tap Area --- */}
      <div className="relative flex-1 flex flex-col items-center justify-center z-10" onClick={handleLike}>
        <div className={`transition-transform duration-75 ${likeCount > 0 ? 'active:scale-90' : ''}`}>
            <Heart 
              size={120} 
              className={`${likeCount >= targetLikes ? 'text-red-500' : 'text-white/10'} transition-colors`}
              fill={likeCount > 0 ? "currentColor" : "none"}
            />
        </div>
        <h2 className="text-white/40 font-black italic text-xl mt-6 animate-bounce uppercase">
            รัวนิ้วกดไลค์!
        </h2>
        <p className="text-[#E491C9] font-bold text-sm">{likeCount} / {targetLikes}</p>
      </div>

      {/* --- Layer 4: Scam Pop-up (ตัวขวาง) --- */}
      {showScamPopUp && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/20 backdrop-blur-[2px] animate-in zoom-in duration-150">
          <button 
            onClick={handleScamClick}
            className="bg-[#F43F5E] text-white p-6 rounded-3xl border-4 border-white shadow-[0_0_40px_rgba(244,63,94,0.6)] flex flex-col items-center gap-2 active:scale-95 transition-transform"
          >
            <DollarSign size={40} className="animate-bounce" />
            <div className="text-center">
                <p className="font-black text-lg leading-tight uppercase">พลังงานหมด!</p>
                <p className="font-bold text-[11px] opacity-80 uppercase tracking-tighter italic">เติมเงิน 500.- เพื่อเป็น VIP</p>
            </div>
          </button>
        </div>
      )}

      {/* --- Layer 5: Fixed UI Bar --- */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20 pointer-events-none">
        <button className="p-2 bg-white/10 rounded-full text-white pointer-events-auto">
          <Info size={24} />
        </button>
        <div className="bg-[#F59E0B] px-4 py-1.5 rounded-full text-black font-black text-[10px] italic shadow-lg">
          LEVEL 6: VIRAL TRAP
        </div>
      </div>

      {/* --- Layer 6: Progress Bar (เวลาเดิน) --- */}
      <div className="absolute bottom-0 left-0 right-0 p-8 pb-10 z-20">
        <div className="flex justify-between mb-2 items-end">
          <div className="flex items-center gap-2 opacity-30 text-white">
            <ShieldAlert size={14} />
            <span className="text-[9px] font-black uppercase tracking-tighter">Verified Activity</span>
          </div>
        </div>
        <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden border border-white/5">
          <div 
            className="h-full bg-[#E491C9] shadow-[0_0_15px_#E491C9] transition-all duration-1000 ease-linear" 
            style={{ width: `${(timeLeft / 10) * 100}%` }} 
          />
        </div>
      </div>

      {/* --- Layer 7: Tutorial Overlay (ต้องอยู่ล่างสุดเพื่อให้ทับทุกอย่าง) --- */}
      <TutorialOverlay 
        isVisible={showTutorial}
        timer={tutorialTimer}
        icon={Heart}
        titleTop="LIKE"
        titleBottom="TRAP"
        subText="รัวนิ้วกดไลค์ให้ครบ แต่ห้ามเผลอกดปุ่มเติมเงิน!"
      />

    </div>
  );
};

export default Level6TikTokScam;