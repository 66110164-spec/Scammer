import React, { useState, useRef, useEffect } from 'react';
import { User, Lock, Globe, AlertTriangle } from 'lucide-react';
import TutorialOverlay from './TutorialOverlay';

interface Props {
  onWin: () => void;
  onLose: () => void;
  timeLeft: number;
  onTutorialToggle: (isShowing: boolean) => void;
  onRetry: () => void;
}

const Level18PrivacyCurtain: React.FC<Props> = ({ onWin, onLose, timeLeft, onTutorialToggle }) => {
  const [showTutorial, setShowTutorial] = useState(true);
  const [tutorialTimer, setTutorialTimer] = useState(5);
  
  const [curtainHeight, setCurtainHeight] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const prevY = useRef<number>(0); // ตัวแปรเก็บตำแหน่ง Y ล่าสุดเพื่อคำนวณระยะลาก

  useEffect(() => {
    if (onTutorialToggle) onTutorialToggle(showTutorial);
  }, [showTutorial, onTutorialToggle]);

  useEffect(() => {
    if (showTutorial && tutorialTimer > 0) {
      const timer = setTimeout(() => setTutorialTimer(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (showTutorial && tutorialTimer === 0) {
      setShowTutorial(false);
    }
  }, [tutorialTimer, showTutorial]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    prevY.current = e.clientY; // เริ่มต้นการลากด้วยตำแหน่งนี้
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    // คำนวณระยะที่ลาก (Delta)
    const deltaY = e.clientY - prevY.current;
    
    // แรงต้าน (0.1 - 1.0) ยิ่งน้อยยิ่งฝืด
    const resistance = 0.9
    
    // คำนวณความสูงใหม่จากระยะที่ลาก * แรงต้าน
    const containerHeight = containerRef.current.offsetHeight;
    const increment = (deltaY / containerHeight) * 100 * resistance;
    
    const newHeight = Math.min(Math.max(curtainHeight + increment, 0), 100);
    
    setCurtainHeight(newHeight);
    prevY.current = e.clientY; // อัปเดตตำแหน่ง Y ล่าสุด
    
    if (newHeight >= 90) {
      onWin();
    }
  };

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 bg-slate-100 select-none touch-none overflow-hidden"
      onPointerMove={handlePointerMove}
      onPointerUp={() => setIsDragging(false)}
      onPointerLeave={() => setIsDragging(false)}
    >
      <div className="flex flex-col items-center pt-20 px-6">
        <div className="w-24 h-24 bg-slate-300 rounded-full mb-4 flex items-center justify-center">
            <User size={48} className="text-white" />
        </div>
        <h2 className="text-xl font-black text-slate-800">My Profile</h2>
        <div className="w-full mt-8 bg-white p-4 rounded-xl border-2 border-rose-200 shadow-sm flex items-center gap-4">
            <Globe className="text-rose-500" />
            <div>
                <p className="font-bold text-slate-800">Status: Public</p>
                <p className="text-[10px] text-slate-500">นายจงรัก ใจดี เบอร์โทร 0922368745</p>
            </div>
        </div>
      </div>

      <div 
        className="absolute top-0 left-0 right-0 bg-slate-900 z-20 flex flex-col items-center justify-center text-white"
        style={{ height: `${curtainHeight}%`, transition: 'height 0.1s ease-out' }}
        onPointerDown={handlePointerDown}
      >
        <div className="w-16 h-2 bg-slate-700 rounded-full mb-4 animate-bounce" />
        <Lock size={48} className="text-emerald-400 mb-2" />
        <p className="font-bold text-sm">Privatizing Profile...</p>
      </div>

      <div className="absolute top-0 w-full h-20 z-30 cursor-grab" onPointerDown={handlePointerDown} />

      <div className="absolute bottom-8 left-8 right-8 bg-white p-4 rounded-xl shadow-lg border border-slate-200">
        <div className="flex items-center gap-3">
            <AlertTriangle className="text-rose-500 shrink-0" />
            <p className="text-xs font-bold text-slate-600">
                โปรไฟล์ของคุณเปิดสาธารณะอยู่! รูดม่านลงมาเพื่อตั้งค่าเป็นส่วนตัว!
            </p>
        </div>
      </div>

      <TutorialOverlay 
        isVisible={showTutorial} 
        timer={tutorialTimer} 
        icon={Lock} 
        titleTop="PULL DOWN" 
        titleBottom="PRIVACY" 
        subText="ใช้นิ้วรูดจากขอบบนหน้าจอลงมา เพื่อรูดม่านปิดสถานะ Public ให้เร็วที่สุด!" 
      />
    </div>
  );
};

export default Level18PrivacyCurtain;