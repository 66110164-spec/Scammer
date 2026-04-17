import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, CheckCircle2, AlertTriangle, ShieldAlert, Info, MousePointer2, CreditCard } from 'lucide-react';
import TutorialOverlay from './TutorialOverlay';

interface Props {
  onWin: () => void;
  onLose: () => void;
  timeLeft: number;
  onTutorialToggle: (isShowing: boolean) => void;
}

const Level7OrderScam: React.FC<Props> = ({ onWin, onLose, timeLeft, onTutorialToggle }) => {
  // --- PART 1: STATES ---
  const [showTutorial, setShowTutorial] = useState(true);
  const [tutorialTimer, setTutorialTimer] = useState(5);
  const [markerPos, setMarkerPos] = useState(0); // 0 ถึง 100
  const [direction, setDirection] = useState(1); // 1 = ขวา, -1 = ซ้าย
  const [score, setScore] = useState(0);
  const targetScore = 3;

  const speed = 2; // ความเร็วของลูกศร

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

  // --- PART 3: TIMING LOGIC (ลูกศรวิ่ง) ---
  useEffect(() => {
  if (showTutorial) return;

  const moveMarker = setInterval(() => {
    setMarkerPos((prev) => {
      // ถ้าชนขอบขวา (98%) ให้เปลี่ยนทิศทางเป็นลบ (-1)
      if (prev >= 98 && direction === 1) {
        setDirection(-1);
        return 98;
      }
      // ถ้าชนขอบซ้าย (2%) ให้เปลี่ยนทิศทางเป็นบวก (1)
      if (prev <= 2 && direction === -1) {
        setDirection(1);
        return 2;
      }
      // ขยับค่าตำแหน่ง
      return prev + (speed * direction);
    });
  }, 16); // 16ms ประมาณ 60 FPS

  return () => clearInterval(moveMarker);
}, [showTutorial, direction]); // ขึ้นอยู่กับ showTutorial และ direction

  // เช็คเวลาหมด
  useEffect(() => {
    if (!showTutorial && timeLeft <= 0) onLose();
  }, [timeLeft, onLose, showTutorial]);

  // --- PART 4: HANDLERS ---
  const handleConfirmOrder = () => {
    if (showTutorial) return;
    
    // จังหวะที่เป๊ะ (Hit Zone อยู่ช่วง 45% - 55%)
    if (markerPos >= 42 && markerPos <= 58) {
      const nextScore = score + 1;
      setScore(nextScore);
      if (nextScore >= targetScore) onWin();
    } else {
      onLose(); // กะจังหวะพลาด = แพ้ (โดนหาว่าทำงานไม่สำเร็จ)
    }
  };

  const handleDepositScam = () => {
    if (showTutorial) return;
    onLose(); // กดปุ่มมัดจำ = เสียเงินทิพย์ = แพ้ทันที
  };

  return (
    <div className="absolute inset-0 bg-[#F8FAFC] overflow-hidden flex flex-col font-sans select-none">
      
      {/* --- Layer 1: Fake Shopping UI --- */}
      <div className="p-6 bg-white border-b shadow-sm">
        <div className="flex items-center gap-2 text-[#15173D]">
          <ShoppingCart size={20} />
          <span className="font-black italic uppercase text-sm">ShopTasker Admin</span>
        </div>
      </div>

      <div className="flex-1 p-6 flex flex-col items-center">
        {/* รายการออเดอร์กองโต */}
        <div className="w-full max-w-sm bg-blue-50 border-2 border-dashed border-blue-200 rounded-3xl p-4 mb-6">
          <div className="flex justify-between items-start mb-3">
             <div className="bg-blue-600 text-white text-[10px] px-2 py-1 rounded-md font-bold uppercase">Pending Order</div>
             <p className="text-[#15173D] font-black text-sm">฿159,000</p>
          </div>
          <div className="space-y-2 opacity-60">
            <div className="h-4 bg-blue-100 rounded w-full" />
            <div className="h-4 bg-blue-100 rounded w-[80%]" />
          </div>
        </div>

        {/* จังหวะการกด (The Gauge) */}
        <div className="w-full max-w-xs bg-gray-200 h-12 rounded-2xl relative mb-12 border-4 border-white shadow-inner overflow-hidden">
          {/* Hit Zone (แถบสีเขียวเล็กๆ ตรงกลาง) */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-12 bg-green-400 border-x-2 border-green-600 flex items-center justify-center">
            <CheckCircle2 size={16} className="text-green-800" />
          </div>
          
          {/* Moving Arrow (ลูกศรที่วิ่งผ่าน) */}
          <div 
            className="absolute top-0 bottom-0 w-2 bg-red-600 shadow-[0_0_10px_red] transition-all duration-[16ms] linear"
            style={{ left: `${markerPos}%` }}
          />
        </div>

        {/* ปุ่มกดวัดใจ (Dark UX) */}
        <div className="w-full max-w-xs space-y-4">
          {/* ปุ่มหลอก (ใหญ่และจูงใจ) */}
          <button 
            onClick={handleDepositScam}
            className="w-full py-6 bg-[#15173D] text-white rounded-3xl shadow-xl active:scale-95 transition-all flex flex-col items-center"
          >
            <CreditCard className="mb-1 text-[#E491C9]" size={24} />
            <span className="font-black text-lg uppercase italic tracking-tighter">โอนมัดจำเพื่อรับงาน (10%)</span>
            <span className="text-[10px] opacity-50 uppercase">สิทธิพิเศษสำหรับสมาชิก VIP เท่านั้น</span>
          </button>

          {/* ปุ่มจริง (เล็กและกดจังหวะ) */}
          <button 
            onClick={handleConfirmOrder}
            className="w-full py-3 border-2 border-[#15173D] text-[#15173D] rounded-2xl font-black italic text-xs uppercase hover:bg-gray-100 active:scale-90 transition-all flex items-center justify-center gap-2"
          >
            <MousePointer2 size={14} />
            ยืนยันออเดอร์ (ไม่ต้องมัดจำ)
          </button>
        </div>
      </div>

      {/* --- Layer 2: Fixed UI --- */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20 pointer-events-none">
        <button className="p-2 bg-black/5 rounded-full text-black/20 pointer-events-auto">
          <Info size={24} />
        </button>
        <div className="bg-[#15173D] px-4 py-1.5 rounded-full text-white font-black text-[10px] italic shadow-lg">
          TASKS: {score}/{targetScore}
        </div>
      </div>

      {/* Progress Bar (เวลาเดิน) */}
      <div className="absolute bottom-0 left-0 right-0 p-8 pb-10 z-20">
        <div className="flex justify-between mb-2 items-end">
          <div className="flex items-center gap-2 opacity-30 text-[#15173D]">
            <ShieldAlert size={14} />
            <span className="text-[9px] font-black uppercase tracking-tighter">Verified System</span>
          </div>
        </div>
        <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#15173D] transition-all duration-1000 ease-linear" 
            style={{ width: `${(timeLeft / 10) * 100}%` }} 
          />
        </div>
      </div>

      {/* --- Layer 3: Tutorial Overlay (Layer บนสุด) --- */}
      <TutorialOverlay 
        isVisible={showTutorial}
        timer={tutorialTimer}
        icon={AlertTriangle}
        titleTop="FAKE"
        titleBottom="ORDER"
        subText="กดปุ่ม 'ยืนยันออเดอร์' ให้ตรงจังหวะ และห้ามกดปุ่ม 'โอนมัดจำ' เด็ดขาด!"
      />

    </div>
  );
};

export default Level7OrderScam;