import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Home } from 'lucide-react';
import TutorialOverlay from './TutorialOverlay';

interface Props {
  onWin: () => void;
  onLose: () => void;
  timeLeft: number;
  onTutorialToggle: (isShowing: boolean) => void;
}

const Level17LiveLocation: React.FC<Props> = ({ onWin, onLose, timeLeft, onTutorialToggle }) => {
  const [showTutorial, setShowTutorial] = useState(true);
  const [tutorialTimer, setTutorialTimer] = useState(5);
  
  const [gpsPos, setGpsPos] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0); 

  const homePos = { x: 50, y: 50 }; 
  const velocity = useRef({ vx: 0.5, vy: 0.5 }); 

  useEffect(() => {
    if (onTutorialToggle) onTutorialToggle(showTutorial);
    if (showTutorial && tutorialTimer > 0) {
      const timer = setTimeout(() => setTutorialTimer(tutorialTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (tutorialTimer === 0) setShowTutorial(false);
  }, [tutorialTimer, showTutorial, onTutorialToggle]);

  useEffect(() => {
    if (showTutorial || isDragging) return;

    const moveGps = () => {
      setGpsPos(prev => {
        let newX = prev.x + velocity.current.vx;
        let newY = prev.y + velocity.current.vy;
        if (newX <= 5 || newX >= 95) velocity.current.vx *= -1;
        if (newY <= 5 || newY >= 95) velocity.current.vy *= -1;
        return { x: newX, y: newY };
      });
      requestAnimationFrame(moveGps);
    };

    const id = requestAnimationFrame(moveGps);
    return () => cancelAnimationFrame(id);
  }, [showTutorial, isDragging]);

  // ✅ ปรับ Logic: ต้องลากค้างไว้เท่านั้นถึงจะเพิ่ม Progress
  useEffect(() => {
    const dist = Math.sqrt(Math.pow(gpsPos.x - homePos.x, 2) + Math.pow(gpsPos.y - homePos.y, 2));
    
    // เงื่อนไขชนะ: ต้องลากอยู่ + อยู่ในระยะบ้าน
    if (isDragging && dist < 15) {
      setProgress(prev => {
        const next = Math.min(prev + 3, 100);
        if (next >= 100) onWin(); 
        return next;
      });
    } else {
      // ถ้าปล่อยมือหรือลากออกนอกเขต ความสำเร็จจะลดลง
      setProgress(prev => Math.max(prev - 2, 0));
    }
  }, [gpsPos, isDragging, onWin]);

  const handlePointerMove = (e: any) => {
    if (!isDragging) return;
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    setGpsPos({ x, y });
  };

  return (
    <div className="absolute inset-0 bg-slate-900 select-none touch-none" 
         onPointerMove={handlePointerMove} 
         onPointerUp={() => setIsDragging(false)}
         onPointerLeave={() => setIsDragging(false)}
    >
      
      {/* HOME */}
      <div 
        className="absolute flex items-center justify-center w-32 h-32 rounded-full p-1 shadow-2xl transition-all duration-300"
        style={{ 
          left: `${homePos.x}%`, top: `${homePos.y}%`, transform: 'translate(-50%, -50%)',
          background: `conic-gradient(#10b981 ${progress}%, #1e293b ${progress}%)` 
        }}
      >
        <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
            <Home className="text-emerald-500" size={40} />
        </div>
      </div>

      {/* GPS */}
      <div 
        className="absolute w-20 h-20 z-50 transition-transform active:scale-110 cursor-grab"
        style={{ left: `${gpsPos.x}%`, top: `${gpsPos.y}%`, transform: 'translate(-50%, -50%)' }}
        onPointerDown={() => setIsDragging(true)}
      >
        <div className="w-full h-full bg-blue-500 rounded-full flex items-center justify-center border-4 border-white shadow-xl animate-pulse">
          <MapPin size={40} className="text-white" />
        </div>
      </div>

      <div className="absolute bottom-8 left-8 right-8 bg-slate-800/80 p-4 rounded-xl border border-slate-600">
        <p className="text-white text-xs font-bold text-center uppercase tracking-wider">
            {progress > 0 ? `กำลังปิดกั้นตำแหน่ง: ${Math.floor(progress)}%` : 'ต้องลากจุดฟ้าค้างไว้ที่บ้านเพื่อปิดตำแหน่ง!'}
        </p>
      </div>

      <TutorialOverlay isVisible={showTutorial} timer={tutorialTimer} icon={MapPin} titleTop="DRAG & HOLD" titleBottom="TO CLOSE" subText="แตะค้างที่จุดสีฟ้า แล้วลากมาไว้ที่บ้านค้างไว้จนกว่าจะเต็ม!" />
    </div>
  );
};

export default Level17LiveLocation;