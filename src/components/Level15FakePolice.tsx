import React, { useState, useEffect } from 'react';
import { ShieldAlert, Phone, User, AlertTriangle } from 'lucide-react';
import TutorialOverlay from './TutorialOverlay';

interface Props {
  onWin: () => void;
  onLose: () => void;
  timeLeft: number;
  onTutorialToggle: (isShowing: boolean) => void;
}

const Level15FakePolice: React.FC<Props> = ({ onWin, onLose, timeLeft, onTutorialToggle }) => {
  const [showTutorial, setShowTutorial] = useState(true);
  const [tutorialTimer, setTutorialTimer] = useState(5);

  useEffect(() => {
    if (onTutorialToggle) onTutorialToggle(showTutorial);
    if (showTutorial && tutorialTimer > 0) {
      const timer = setTimeout(() => setTutorialTimer(tutorialTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (tutorialTimer === 0) setShowTutorial(false);
  }, [tutorialTimer, showTutorial, onTutorialToggle]);

  return (
    // ✅ เพิ่มเงื่อนไข !showTutorial ถ้า tutorial ปิดอยู่ถึงจะใส่ class animate-shake
    <div className={`absolute inset-0 bg-slate-900 overflow-hidden font-sans select-none touch-none ${!showTutorial ? 'animate-shake' : ''}`}>
      
      <style>{`
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
        .animate-shake { animation: shake 0.1s infinite; }
      `}</style>

      {/* --- HEADER --- */}
      <div className="p-6 text-center">
        <div className="inline-block p-4 rounded-full bg-rose-600/20 mb-2 animate-pulse">
            <ShieldAlert size={48} className="text-rose-500" />
        </div>
        <h1 className="text-white font-black text-2xl italic tracking-tight uppercase">Incoming Call</h1>
        <p className="text-rose-400 font-bold text-sm uppercase">ตำรวจ (ปลอม) กำลังขู่คุณ!</p>
      </div>

      {/* --- CHAT/CALL AREA --- */}
      <div className="px-6 py-4">
        <div className="bg-slate-800 p-6 rounded-[2rem] border-2 border-slate-700 shadow-2xl relative">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full flex items-center justify-center border-4 border-slate-600">
                    <User size={32} className="text-white" />
                </div>
                <div>
                    <h2 className="text-white font-black">สารวัตร (ตัวปลอม)</h2>
                    <p className="text-slate-400 text-xs font-bold">บันทึกเบอร์แล้ว: "Police"</p>
                </div>
            </div>
            
            <div className="bg-slate-900 p-4 rounded-xl text-white text-sm font-bold border-l-4 border-rose-500">
                "หนูมีส่วนเกี่ยวข้องกับคดีฟอกเงิน! ถ้าไม่อยากติดคุก ให้รีบโอนเงินมาตรวจสอบด่วนภายใน 1 นาที!"
            </div>
        </div>
      </div>

      {/* --- BUTTONS --- */}
      <div className="absolute bottom-10 left-6 right-6 flex flex-col gap-3 z-10">
        {/* Wrong Choice 1 */}
        <button 
          onClick={onLose}
          className="w-full bg-rose-600 text-white font-black py-4 rounded-2xl shadow-lg border-b-4 border-rose-800 active:scale-95 transition-all"
        >
          โอนทันที (กลัวโดนจับ)
        </button>

        {/* Wrong Choice 2 */}
        <button 
          onClick={onLose}
          className="w-full bg-amber-500 text-slate-900 font-black py-4 rounded-2xl shadow-lg border-b-4 border-amber-700 active:scale-95 transition-all"
        >
          ร้องไห้ด้วยความกลัว
        </button>

        {/* Correct Choice */}
        <button 
          onClick={onWin}
          className="w-full bg-emerald-500 text-white font-black py-5 rounded-2xl shadow-lg border-b-4 border-emerald-700 text-lg active:scale-95 transition-all animate-bounce"
        >
          วางสาย แล้วบอกแม่! 🛡️
        </button>
      </div>

      <TutorialOverlay 
        isVisible={showTutorial}
        timer={tutorialTimer}
        icon={Phone}
        titleTop="DON'T"
        titleBottom="PANIC"
        subText="เลือก 'วางสายแล้วบอกแม่' ให้เร็วที่สุด! ตำรวจจริงไม่โทรมาขู่ให้โอนเงินแบบนี้!"
      />
    </div>
  );
};

export default Level15FakePolice;