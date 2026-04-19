import React, { useRef, useState, useEffect } from 'react';
import { ShieldAlert, User } from 'lucide-react';
import TutorialOverlay from './TutorialOverlay';

interface Props {
  onWin: () => void;
  onLose: () => void;
  timeLeft: number;
  onTutorialToggle: (isShowing: boolean) => void;
}

const Level20QRBlackout: React.FC<Props> = ({ onWin, onLose, timeLeft, onTutorialToggle }) => {
  const [showTutorial, setShowTutorial] = useState(true);
  const [tutorialTimer, setTutorialTimer] = useState(5);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [progress, setProgress] = useState(0); // เปอร์เซ็นต์การถมดำ

  useEffect(() => {
    if (showTutorial && tutorialTimer > 0) {
      const timer = setTimeout(() => setTutorialTimer(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (tutorialTimer === 0) {
      setShowTutorial(false);
    }
  }, [tutorialTimer, showTutorial]);

  useEffect(() => {
    onTutorialToggle(showTutorial);
  }, [showTutorial, onTutorialToggle]);

  // ตั้งค่า Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.lineCap = 'round';
    ctx.lineWidth = 30; // ขนาดหัวปากกา
    ctx.strokeStyle = '#000000'; // สีดำ
  }, []);

  const getPos = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e: React.PointerEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const draw = (e: React.PointerEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);

    // เช็คความคืบหน้า (ในโปรเจกต์จริง อาจเช็ค pixel ที่ถมดำ)
    setProgress(prev => Math.min(prev + 0.5, 100));
  };

  // ตรวจสอบชนะ
  useEffect(() => {
    if (progress >= 80) { // ถมครบ 80% ให้ชนะ
        onWin();
    }
  }, [progress, onWin]);

  return (
    <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center p-4 touch-none">
      
      {/* บัตรนักเรียน */}
      <div className="relative w-80 h-48 bg-white rounded-xl shadow-2xl p-4 flex gap-4 overflow-hidden">
        <div className="w-16 h-16 bg-slate-200 rounded-lg flex items-center justify-center">
            <User size={32} className="text-slate-400" />
        </div>
        <div>
            <h3 className="font-bold text-slate-800">Student ID: 69921</h3>
            <p className="text-xs text-slate-500">Name: สมชาย รักเรียน</p>
        </div>

        {/* QR Code (เป้าหมายที่ต้องถม) */}
        <div className="absolute bottom-4 right-4 w-20 h-20 bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center">
             <div className="grid grid-cols-3 gap-0.5 opacity-50">
                {[...Array(9)].map((_, i) => <div key={i} className="w-4 h-4 bg-slate-800" />)}
             </div>
        </div>
      </div>

      {/* Canvas สำหรับระบายสีดำ */}
      <canvas
        ref={canvasRef}
        className="absolute w-80 h-48 rounded-xl z-10 cursor-crosshair"
        onPointerDown={startDrawing}
        onPointerMove={draw}
        onPointerUp={() => setIsDrawing(false)}
        onPointerLeave={() => setIsDrawing(false)}
        width={320}
        height={192}
      />

      <div className="mt-8 text-white text-center">
        <ShieldAlert className="inline-block text-yellow-400 mb-2" />
        <p className="font-bold">อย่าให้ใครเห็น QR Code!</p>
        <p className="text-sm opacity-70">ใช้นิ้วระบายทับให้มิดก่อนโดนแคปจอ!</p>
      </div>

      <TutorialOverlay 
        isVisible={showTutorial} 
        timer={tutorialTimer} 
        icon={ShieldAlert} 
        titleTop="BLACKOUT" 
        titleBottom="PRIVACY" 
        subText="ใช้นิ้วระบายสีดำทับ QR Code ให้มิดเพื่อป้องกันข้อมูลรั่วไหล!" 
      />
    </div>
  );
};

export default Level20QRBlackout;