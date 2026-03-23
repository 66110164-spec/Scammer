import React, { useState, useEffect, useMemo } from 'react';
import { Phone, PhoneOff, ShieldAlert, PhoneIncoming } from 'lucide-react';

interface Level3Props {
  onWin: () => void;
  onLose: () => void;
  timeLeft: number;
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
  { id: 6, name: "ป้าข้างบ้าน", number: "02-XXX-XXXX", isSafe: true },
  { id: 7, name: "ตำรวจไซเบอร์", number: "086-XXX-XXXX", isSafe: false },
];

const Level3Call: React.FC<Level3Props> = ({ onWin, onLose, timeLeft }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  
  const TOTAL_CALLS = 3;

  const sequence = useMemo(() => {
    return [...ALL_CALLERS]
      .sort(() => Math.random() - 0.5)
      .slice(0, TOTAL_CALLS);
  }, []);

  const currentCaller = sequence[currentIdx];

  useEffect(() => {
    if (timeLeft <= 0) {
      onLose();
    }
  }, [timeLeft, onLose]);

  const handleDecision = (choice: 'accept' | 'decline') => {
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
    <div className="flex flex-col items-center justify-center min-h-full w-full space-y-4 p-4 max-w-sm mx-auto">
      
      {/* Progress Dots */}
      <div className="flex space-x-2">
        {[...Array(TOTAL_CALLS)].map((_, i) => (
          <div 
            key={i} 
            className={`w-3 h-3 rounded-full border-2 border-[#15173D] transition-colors ${
              i < currentIdx ? 'bg-green-500' : i === currentIdx ? 'bg-[#982598] animate-pulse' : 'bg-white'
            }`}
          />
        ))}
      </div>

      {/* Main Card - ปรับลดขนาด Padding และความสูงเพื่อให้พอดีจอมือถือ */}
      <div className="w-full bg-white border-4 border-[#15173D] rounded-[2.5rem] p-5 shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
        <div className="absolute top-0 w-full h-16 bg-[#F1E9E9]" />
        
        <div className="z-10 mt-2 space-y-4 w-full">
          <div className="bg-[#15173D] p-4 rounded-full text-[#F1E9E9] mx-auto w-fit shadow-lg">
            <PhoneIncoming size={40} />
          </div>
          
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-[#15173D] tracking-tighter uppercase italic truncate">
              {currentCaller.name}
            </h3>
            <p className="text-[#982598] font-black text-base">{currentCaller.number}</p>
          </div>
          
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest animate-pulse">สายเรียกเข้า...</p>
        </div>

        {/* Buttons - ปรับขนาดให้ Compact ขึ้น */}
        <div className="flex w-full mt-8 justify-between gap-4 px-2">
          <button 
            onClick={() => handleDecision('decline')}
            className="flex-1 bg-red-500 hover:bg-red-600 p-4 rounded-2xl border-b-4 border-red-800 text-white flex flex-col items-center gap-1 active:translate-y-1 active:border-b-0 transition-all"
          >
            <PhoneOff size={24} />
            <span className="font-black text-[10px] uppercase">วางสาย</span>
          </button>
          
          <button 
            onClick={() => handleDecision('accept')}
            className="flex-1 bg-green-500 hover:bg-green-600 p-4 rounded-2xl border-b-4 border-green-800 text-white flex flex-col items-center gap-1 active:translate-y-1 active:border-b-0 transition-all"
          >
            <Phone size={24} />
            <span className="font-black text-[10px] uppercase">รับสาย</span>
          </button>
        </div>
      </div>

      {/* Footer Instruction */}
      <div className="bg-[#E491C9]/20 px-4 py-2 rounded-full border-2 border-[#982598] flex items-center space-x-2">
         <ShieldAlert size={14} className="text-[#982598]" />
         <span className="text-[#15173D] font-black text-[10px] italic uppercase">
            จัดการสายเรียกเข้า {TOTAL_CALLS} สายให้ถูกต้อง!
         </span>
      </div>
    </div>
  );
};

export default Level3Call;