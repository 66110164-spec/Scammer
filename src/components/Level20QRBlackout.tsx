import React, { useRef, useState, useEffect } from 'react';
import { ShieldAlert, User, RefreshCw, XCircle } from 'lucide-react';
import TutorialOverlay from './TutorialOverlay';

interface Props {
  onWin: () => void;
  onLose: () => void; // ฟังก์ชันนี้จะถูกเรียกเมื่อแพ้
  timeLeft: number;
  onTutorialToggle: (isShowing: boolean) => void;
  onRetry: () => void; // เพิ่มฟังก์ชันให้กดเริ่มใหม่
}

const Level20QRBlackout: React.FC<Props> = ({ onWin, onLose, timeLeft, onTutorialToggle, onRetry }) => {
  const [showTutorial, setShowTutorial] = useState(true);
  const [tutorialTimer, setTutorialTimer] = useState(5);
  const [isGameOver, setIsGameOver] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [progress, setProgress] = useState(0);

  // ตรวจสอบเวลาหมด
  useEffect(() => {
    if (timeLeft <= 0 && !showTutorial && !isGameOver) {
      setIsGameOver(true);
      onLose();
    }
  }, [timeLeft, showTutorial, isGameOver, onLose]);

  // ระบบนับถอยหลัง Tutorial
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

  // Canvas Logic
  const draw = (e: React.PointerEvent) => {
    if (!isDrawing || isGameOver) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);

    setProgress(prev => Math.min(prev + 0.8, 100));
  };

  useEffect(() => {
    if (progress >= 80) onWin();
  }, [progress, onWin]);

  return (
    <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center p-4 touch-none">
      
      {/* หน้าจอ Game Over */}
      {isGameOver && (
        <div className="absolute inset-0 z-50 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-white text-center animate-in fade-in duration-300">
          <XCircle size={64} className="text-rose-500 mb-4" />
          <h2 className="text-2xl font-black mb-2">ข้อมูลรั่วไหล!</h2>
          <p className="text-sm opacity-80 mb-6">
            คุณโพสต์รูปที่มี QR Code โดยไม่ได้ปิดบัง! มิจฉาชีพสามารถสแกนเพื่อเข้าถึงข้อมูลส่วนตัวของคุณได้ทันที
          </p>
          
          <div className="bg-white/10 p-4 rounded-lg border border-white/20 mb-6 w-full max-w-sm">
            <h4 className="font-bold text-yellow-400 mb-1">ความจริงที่น่าตกใจ:</h4>
            <p className="text-xs">
              จากรายงานความปลอดภัยไซเบอร์ กว่า <strong>25% ของผู้ใช้มือถือ</strong> เคยเผลอเปิดเผยข้อมูลส่วนตัวผ่านการสแกน QR Code ที่ไม่ตรวจสอบ หรือการโพสต์ข้อมูลที่แฝงด้วย QR Code ลง Social Media จนตกเป็นเหยื่อมิจฉาชีพ
            </p>
          </div>

          <button onClick={onRetry} className="bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 px-8 rounded-full flex items-center gap-2 transition-all">
            <RefreshCw size={20} /> ลองใหม่อีกครั้ง
          </button>
        </div>
      )}

      {/* บัตรนักเรียน */}
      <div className="relative w-80 h-48 bg-white rounded-xl shadow-2xl p-4 flex gap-4 overflow-hidden">
        <div className="w-16 h-16 bg-slate-200 rounded-lg flex items-center justify-center">
            <User size={32} className="text-slate-400" />
        </div>
        <div>
            <h3 className="font-bold text-slate-800">Student ID: 69921</h3>
            <p className="text-xs text-slate-500">Name: สมชาย รักเรียน</p>
        </div>

        <div className="absolute bottom-4 right-4 w-20 h-20 bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center">
             <div className="grid grid-cols-3 gap-0.5 opacity-50">
                {[...Array(9)].map((_, i) => <div key={i} className="w-4 h-4 bg-slate-800" />)}
             </div>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className="absolute w-80 h-48 rounded-xl z-20 cursor-crosshair touch-none"
        onPointerDown={() => { setIsDrawing(true); canvasRef.current?.getContext('2d')?.beginPath(); }}
        onPointerMove={draw}
        onPointerUp={() => setIsDrawing(false)}
        width={320} height={192}
      />

      <TutorialOverlay 
        isVisible={showTutorial} 
        timer={tutorialTimer} 
        icon={ShieldAlert} 
        titleTop="BLACKOUT" 
        titleBottom="PRIVACY" 
        subText="ใช้นิ้วระบายสีดำทับ QR Code ให้มิดก่อนเวลาจะหมด!" 
      />
    </div>
  );
};

export default Level20QRBlackout;