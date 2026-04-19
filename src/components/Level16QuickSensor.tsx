import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Upload, AlertTriangle, Eraser, Info } from 'lucide-react';
import TutorialOverlay from './TutorialOverlay';

interface Props {
  onWin: () => void;
  onLose: () => void;
  timeLeft: number;
  onTutorialToggle: (isShowing: boolean) => void;
}

const Level15QuickSensor: React.FC<Props> = ({ onWin, onLose, timeLeft, onTutorialToggle }) => {
  const [showTutorial, setShowTutorial] = useState(true);
  const [tutorialTimer, setTutorialTimer] = useState(5);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasScrubbed, setHasScrubbed] = useState(false);
  const [isCensored, setIsCensored] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (onTutorialToggle) onTutorialToggle(showTutorial);
    if (showTutorial && tutorialTimer > 0) {
      const timer = setTimeout(() => setTutorialTimer(tutorialTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (tutorialTimer === 0) setShowTutorial(false);
  }, [tutorialTimer, showTutorial, onTutorialToggle]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.lineCap = 'round';
    context.lineWidth = 35;
    context.strokeStyle = 'black'; 
    contextRef.current = context;
  }, []);

  const draw = (e: any) => {
    if (!isDrawing || !contextRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
    setHasScrubbed(true);
    setIsCensored(true);
  };

  return (
    <div className="absolute inset-0 bg-slate-950 font-sans select-none touch-none overflow-hidden">
      
      {/* ID CARD ART */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl overflow-hidden border-2 border-blue-900">
          <div className="bg-blue-900 text-white p-2 text-center text-[10px] font-bold tracking-widest">
            บัตรประจำตัวประชาชน (THAILAND IDENTIFICATION CARD)
          </div>
          <div className="p-4 flex gap-4">
            <div className="w-24 h-32 bg-slate-200 border-2 border-slate-300 rounded flex items-center justify-center text-[10px] text-slate-400">PHOTO</div>
            <div className="flex-1 space-y-2">
              <div className="h-3 w-full bg-slate-200 rounded"></div>
              <div className="h-3 w-4/5 bg-slate-200 rounded"></div>
              {/* ID Data */}
              <div className="mt-4 p-2 bg-slate-50 border-l-4 border-blue-900">
                <p className="text-[9px] font-bold text-slate-500">เลขประจำตัวประชาชน</p>
                <p className="text-sm font-mono font-black text-slate-800 tracking-wider">1-1234-56789-01-2</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <canvas 
        ref={canvasRef}
        className="absolute inset-0 z-10 w-full h-full cursor-crosshair touch-none"
        onMouseDown={(e) => {setIsDrawing(true); draw(e);}}
        onMouseUp={() => setIsDrawing(false)}
        onMouseMove={draw}
        onTouchStart={(e) => {setIsDrawing(true); draw(e);}}
        onTouchEnd={() => setIsDrawing(false)}
        onTouchMove={draw}
      />

      {/* FOOTER ACTIONS */}
      <div className="absolute bottom-6 left-6 right-6 z-20 flex gap-4">
        <button 
          onClick={onLose} // กดโพสต์ = แพ้
          className="flex-1 bg-rose-600 text-white font-black py-4 rounded-xl shadow-lg hover:bg-rose-700 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Upload size={20} /> โพสต์เลย!
        </button>
        <button 
          onClick={onWin} // กดลบ = ชนะ
          className="flex-1 bg-emerald-500 text-white font-black py-4 rounded-xl shadow-lg hover:bg-emerald-600 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Trash2 size={20} /> ลบทิ้งดีกว่า!
        </button>
      </div>

      <div className="absolute top-10 left-0 right-0 text-center px-6">
         <div className="bg-black/60 text-white p-3 rounded-lg backdrop-blur text-xs font-bold flex items-center gap-2">
            <Info size={16} className="text-blue-400" />
            แม้จะลบเลขแล้ว แต่การโชว์บัตรก็มีความเสี่ยง... ลบทิ้งปลอดภัยที่สุด!
         </div>
      </div>

      <TutorialOverlay 
        isVisible={showTutorial}
        timer={tutorialTimer}
        icon={Eraser}
        titleTop="DON'T POST"
        titleBottom="PERSONAL DATA"
        subText="ลากถูเพื่อเซนเซอร์ แต่จำไว้ว่า: การโพสต์บัตรประชาชนนั้นอันตรายมาก! กด 'ลบทิ้ง' เพื่อความปลอดภัย"
      />
    </div>
  );
};

export default Level15QuickSensor;