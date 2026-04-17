import React, { useState, useEffect } from 'react';
import { CreditCard, Grid3X3, ShieldAlert, Info, AlertTriangle, Fingerprint } from 'lucide-react';
import TutorialOverlay from './TutorialOverlay';

interface Props {
  onWin: () => void;
  onLose: () => void;
  timeLeft: number;
  onTutorialToggle: (isShowing: boolean) => void;
}

const Level9MuleAccount: React.FC<Props> = ({ onWin, onLose, timeLeft, onTutorialToggle }) => {
  const [showTutorial, setShowTutorial] = useState(true);
  const [tutorialTimer, setTutorialTimer] = useState(5);
  const [targetPin, setTargetPin] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isShowingPin, setIsShowingPin] = useState(true);
  const [step, setStep] = useState(1); // 1 = จำรหัส, 2 = กรอกรหัส
  const totalSteps = 2; // ทำ 2 รอบเพื่อผ่านด่าน

  // --- 1. TUTORIAL & SETUP ---
  useEffect(() => {
    if (onTutorialToggle) onTutorialToggle(showTutorial);
    if (showTutorial && tutorialTimer > 0) {
      const timer = setTimeout(() => setTutorialTimer(tutorialTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (tutorialTimer === 0) {
      setShowTutorial(false);
      generateNewPin();
    }
  }, [tutorialTimer, showTutorial]);

  const generateNewPin = () => {
    const newPin = Math.floor(100000 + Math.random() * 900000).toString();
    setTargetPin(newPin);
    setUserInput("");
    setIsShowingPin(true);
    setStep(1);
    
    // โชว์รหัสแค่ 2 วินาทีแล้วให้กรอก
    setTimeout(() => {
      setIsShowingPin(false);
      setStep(2);
    }, 2000);
  };

  // --- 2. GAMEPLAY LOGIC ---
  const handleKeypadClick = (num: string) => {
    if (step !== 2) return;
    
    const nextInput = userInput + num;
    setUserInput(nextInput);

    // ถ้ากดครบ 6 หลัก
    if (nextInput.length === 6) {
      if (nextInput === targetPin) {
        // กรอกถูก
        onWin(); // ในเกมนี้ถ้าทำตามมิจฉาชีพจนจบคือ "ผ่านด่าน" เพื่อไปด่านต่อไป (แต่แฝงคำเตือน)
      } else {
        // กรอกผิด = เสียสมาธิ/มิจฉาชีพด่า = แพ้
        onLose();
      }
    }
  };

  const handleClear = () => setUserInput("");

  return (
    <div className="absolute inset-0 bg-[#1E293B] overflow-hidden flex flex-col font-sans select-none">
      
      {/* --- ATM Screen Area --- */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        {/* ATM Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none" />

        <div className="w-full max-w-sm bg-black border-4 border-slate-700 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
          {/* Screen Content */}
          <div className="bg-[#101827] border-2 border-emerald-500/30 rounded-xl p-6 min-h-[200px] flex flex-col items-center justify-center text-center">
            {isShowingPin ? (
              <div className="animate-in fade-in duration-500">
                <p className="text-emerald-500 font-bold text-xs uppercase mb-2 tracking-widest">จำรหัสถอนเงินม้า</p>
                <h2 className="text-white text-5xl font-black tracking-[0.2em] shadow-emerald-500/50 drop-shadow-md">
                  {targetPin}
                </h2>
                <div className="mt-4 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-500 animate-[progress_2s_linear_forwards]" style={{width: '100%'}} />
                </div>
              </div>
            ) : (
              <div className="animate-in zoom-in duration-300">
                <p className="text-amber-500 font-bold text-xs uppercase mb-4 italic">! ป้อนรหัส 6 หลักเพื่อรับเงิน !</p>
                <div className="flex gap-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className={`w-10 h-14 border-2 rounded-lg flex items-center justify-center text-2xl font-black
                      ${userInput.length > i ? "border-emerald-500 text-white bg-emerald-500/20" : "border-slate-700 text-slate-700"}`}>
                      {userInput[i] ? "*" : ""}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Card Slot Decor */}
          <div className="mt-4 flex justify-between items-center opacity-40">
            <div className="w-20 h-1 bg-slate-800 rounded" />
            <CreditCard size={24} className="text-slate-600" />
            <div className="w-20 h-1 bg-slate-800 rounded" />
          </div>
        </div>
      </div>

      {/* --- Keypad Area (Bottom) --- */}
      <div className="bg-[#0F172A] p-6 pb-12 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-slate-800">
        <div className="grid grid-cols-3 gap-3 max-w-[280px] mx-auto">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "CLR", "0", "OK"].map((btn) => (
            <button
              key={btn}
              onClick={() => {
                if (btn === "CLR") handleClear();
                else if (btn === "OK") return;
                else handleKeypadClick(btn);
              }}
              className={`h-16 rounded-2xl font-black text-xl transition-all active:scale-90 flex items-center justify-center
                ${btn === "CLR" ? "bg-rose-500/20 text-rose-500" : 
                  btn === "OK" ? "bg-emerald-500/20 text-emerald-500" : 
                  "bg-slate-800 text-white border-b-4 border-black"}`}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>

      {/* Progress & Tutorial */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20">
        <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full text-white/50 text-[10px] font-bold italic">
          <Fingerprint size={14} /> SECURITY BYPASS
        </div>
        <div className="bg-amber-500 px-4 py-1.5 rounded-full text-black font-black text-[10px] italic shadow-lg">
          LEVEL 9: MULE ACCOUNT
        </div>
      </div>

      <TutorialOverlay 
        isVisible={showTutorial}
        timer={tutorialTimer}
        icon={Grid3X3}
        titleTop="MULE"
        titleBottom="PIN"
        subText="จำรหัส 6 หลักที่ปรากฏ แล้วกรอกให้ถูกต้องเพื่อรับเงิน (ระวัง! บัญชีม้าติดคุกจริง)"
      />
    </div>
  );
};

export default Level9MuleAccount;

// เพิ่ม CSS Animation สำหรับ Progress Bar ในไฟล์ CSS หลักของคุณ
/*
@keyframes progress {
  from { width: 100%; }
  to { width: 0%; }
}
*/