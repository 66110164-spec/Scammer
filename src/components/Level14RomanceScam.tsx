import React, { useState, useEffect, useRef } from 'react';
import { Heart, User, MessageCircle, AlertTriangle, CreditCard, X, Sparkles } from 'lucide-react';
import TutorialOverlay from './TutorialOverlay';

interface Props {
  onWin: () => void;
  onLose: () => void;
  timeLeft: number;
  onTutorialToggle: (isShowing: boolean) => void;
}

const Level14RomanceScam: React.FC<Props> = ({ onWin, onLose, timeLeft, onTutorialToggle }) => {
  const [showTutorial, setShowTutorial] = useState(true);
  const [tutorialTimer, setTutorialTimer] = useState(5);
  
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [scamProgress, setScamProgress] = useState(0); // 0-100 ถ้าถึง 100 ปุ่มโอนเงินจะโผล่มา
  const [isTransferButtonVisible, setIsTransferButtonVisible] = useState(false);

  // 1. Tutorial Logic
  useEffect(() => {
    if (onTutorialToggle) onTutorialToggle(showTutorial);
    if (showTutorial && tutorialTimer > 0) {
      const timer = setTimeout(() => setTutorialTimer(tutorialTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (tutorialTimer === 0) setShowTutorial(false);
  }, [tutorialTimer, showTutorial, onTutorialToggle]);

  // 2. Spawn Hearts & Progress Logic
  useEffect(() => {
    if (showTutorial || isTransferButtonVisible) return;

    // สุ่มเกิดหัวใจ
    const spawnHeart = setInterval(() => {
      const newHeart = {
        id: Date.now(),
        x: Math.random() * 80 + 10,
        y: Math.random() * 60 + 10,
      };
      setHearts(prev => [...prev, newHeart]);
    }, 600);

    // ความคืบหน้าการหลอกลวง
    const progressInterval = setInterval(() => {
      setScamProgress(prev => {
        if (prev >= 100) {
          setIsTransferButtonVisible(true);
          return 100;
        }
        return prev + 0.6; 
      });
    }, 100);
    return () => {
      clearInterval(spawnHeart);
      clearInterval(progressInterval);
    };
  }, [showTutorial, isTransferButtonVisible]);

  // Win Condition: ถ้ากดหัวใจหมด (ในที่นี้คือเอาชนะเกมโดยกดจนจบเวลา)
  useEffect(() => {
    if (!showTutorial && timeLeft <= 0 && !isTransferButtonVisible) {
      onWin();
    }
  }, [timeLeft, onWin, showTutorial, isTransferButtonVisible]);

  const popHeart = (id: number) => {
    setHearts(prev => prev.filter(h => h.id !== id));
    // เดิมลด 3 ปรับเป็นลด 5 ต่อการกด 1 ครั้ง
    setScamProgress(prev => Math.max(0, prev - 5));
  };

  return (
    <div className="absolute inset-0 bg-pink-50 overflow-hidden font-sans select-none">
      
      {/* --- CHAT HEADER --- */}
      <div className="bg-white p-4 flex items-center gap-3 border-b border-pink-200 shadow-sm z-20 relative">
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-tr from-pink-400 to-rose-400 rounded-full overflow-hidden border-2 border-white shadow-lg">
             <User size={30} className="text-white mt-3 mx-auto" />
          </div>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
        </div>
        <div>
          <h2 className="font-black text-slate-800 text-sm">"Honey Bunny" 💕</h2>
          <p className="text-emerald-500 text-[10px] font-bold">Online</p>
        </div>
      </div>

      {/* --- CHAT AREA --- */}
      <div className="relative flex-1 h-full p-4">
        {/* Scammer Message */}
        <div className="flex flex-col gap-2 mb-6">
          <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-md max-w-[80%] border border-pink-100">
            <p className="text-xs font-bold text-slate-600 leading-relaxed">
              "ที่รัก... ฉันติดด่านศุลกากร ของขวัญเซอร์ไพรส์ฉันถูกกักไว้... รบกวนช่วยโอนค่าธรรมเนียมให้หน่อยนะ เดี๋ยวฉันจะบินไปหาทันที! ✈️💌"
            </p>
          </div>
        </div>

        {/* Floating Hearts */}
        {hearts.map(heart => (
          <div 
            key={heart.id}
            className="absolute cursor-pointer animate-in zoom-in duration-300"
            style={{ left: `${heart.x}%`, top: `${heart.y}%` }}
            onClick={() => popHeart(heart.id)}
          >
            <Heart size={40} className="text-rose-500 fill-rose-500 hover:scale-125 transition-transform" />
          </div>
        ))}
      </div>

      {/* --- TRANSFER BUTTON (THE TRAP) --- */}
      {isTransferButtonVisible && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
           <AlertTriangle size={80} className="text-rose-500 animate-bounce mb-4" />
           <h2 className="font-black text-2xl text-slate-800 mb-6">โดนหลอกแล้ว!</h2>
           <button 
             onClick={onLose}
             className="bg-rose-600 text-white font-black py-4 px-10 rounded-full shadow-xl hover:bg-rose-700 animate-pulse"
           >
             <CreditCard className="inline mr-2" /> โอนเงินด่วน (โอน = เสียเงิน!)
           </button>
        </div>
      )}

      {/* --- HUD --- */}
      <div className="absolute bottom-24 left-0 right-0 px-4">
        <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black text-rose-500 uppercase">ทำลายความรักลวงโลก: {hearts.length}</span>
            <span className="text-[10px] font-black text-slate-400 uppercase">อันตราย: {Math.floor(scamProgress)}%</span>
        </div>
        <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${scamProgress > 80 ? 'bg-rose-600 animate-pulse' : 'bg-rose-400'}`}
            style={{ width: `${scamProgress}%` }}
          />
        </div>
      </div>

      <TutorialOverlay 
        isVisible={showTutorial}
        timer={tutorialTimer}
        icon={Heart}
        titleTop="POP"
        titleBottom="HEARTS"
        subText="กดทำลายหัวใจสีชมพูให้หมด ก่อนที่มันจะรวมตัวกลายเป็นปุ่มโอนเงิน!"
      />
    </div>
  );
};

export default Level14RomanceScam;