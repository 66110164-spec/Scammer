import React, { useState, useRef, useEffect } from 'react';
import { Fingerprint, ShieldAlert } from 'lucide-react';

interface Level2Props {
  onWin: () => void;
  onLose: () => void;
  timeLeft: number;
  onTutorialToggle?: (isShowing: boolean) => void;
}

// --- Pencil Icon: ปรับโฉมเป็น Marker หัวตัดสุดเท่ ---
const PencilIcon = () => (
  <div className="group relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
    <div className="absolute inset-0 bg-[#C98BFF] rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
    <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-b from-[#C98BFF] to-[#982598] rounded-full shadow-[0_8px_0_0_#6A1B6A,0_15px_20px_rgba(0,0,0,0.3)] flex items-center justify-center border-2 border-white/20 overflow-hidden active:translate-y-[4px] active:shadow-[0_4px_0_0_#6A1B6A,0_10px_15px_rgba(0,0,0,0.3)] transition-all">
      <div className="absolute inset-0 opacity-30 pointer-events-none" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} 
      />
      <div className="relative z-10 rotate-[-15deg] group-hover:rotate-0 transition-transform duration-300 scale-110">
        <svg width="35" height="55" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5L28 5L32 15L8 15L12 5Z" fill="#711A71" />
          <path d="M12 5L20 5L22 15L10 15L12 5Z" fill="#982598" />
          <rect x="6" y="15" width="28" height="6" rx="1" fill="#D1D5DB" />
          <rect x="4" y="21" width="32" height="35" rx="4" fill="#15173D" />
          <rect x="4" y="28" width="32" height="10" fill="#E491C9" fillOpacity="0.8" />
        </svg>
      </div>
      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-12 h-6 bg-white/20 rounded-full blur-sm" />
    </div>
  </div>
);

// --- Trash Icon: อัปเกรดให้ดูมีมิติ ---
const TrashIcon = () => (
  <div className="group relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
    <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-b from-[#4A4E91] to-[#15173D] rounded-[1.5rem] sm:rounded-[2rem] shadow-[0_8px_0_0_#0D0E25,0_15px_25px_rgba(0,0,0,0.4)] flex items-center justify-center border-2 border-white/10 overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} 
      />
      <div className="relative z-10 flex flex-col items-center group-hover:scale-110 transition-transform">
        <div className="w-8 h-1.5 bg-[#E491C9] rounded-full relative mb-0.5 shadow-sm">
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-1.5 bg-[#E491C9] rounded-t-full" />
        </div>
        <div className="w-7 h-8 bg-white rounded-b-md p-1.5 flex justify-around shadow-inner">
          <div className="w-1 h-full bg-gray-200 rounded-full" />
          <div className="w-1 h-full bg-gray-200 rounded-full" />
        </div>
      </div>
    </div>
  </div>
);

const Level2Package: React.FC<Level2Props> = ({ onWin, onLose, timeLeft, onTutorialToggle }) => {
  const [erasedPercent, setErasedPercent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [tutorialTimer, setTutorialTimer] = useState(5);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastPos = useRef<{ x: number, y: number } | null>(null);

  const grainyTexture = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)'/%3E%3C/svg%3E")`,
  };

  useEffect(() => {
    if (onTutorialToggle) onTutorialToggle(true);
  }, [onTutorialToggle]);

  useEffect(() => {
    if (showTutorial && tutorialTimer > 0) {
      const timer = setTimeout(() => setTutorialTimer(tutorialTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (tutorialTimer === 0) {
      setShowTutorial(false);
      if (onTutorialToggle) onTutorialToggle(false);
    }
  }, [tutorialTimer, showTutorial, onTutorialToggle]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF'; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#111827';
        ctx.font = 'bold 18px Prompt, sans-serif';
        ctx.fillText('นาย จอมยุทธ์ 1441', 20, 50); 
        ctx.font = '14px Prompt, sans-serif';
        ctx.fillText('บ้านเลขที่ 14 หมู่ 67 ระยอง', 20, 85);
        ctx.font = 'bold 12px Prompt, sans-serif';
        ctx.fillText('โทร: 081-XXX-XXXX', 20, 115);
      }
    }
  }, []);

  const getPos = (e: any) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvasRef.current!.width / rect.width),
      y: (clientY - rect.top) * (canvasRef.current!.height / rect.height)
    };
  };

  const handleMouseDown = (e: any) => { 
    if (showTutorial) return;
    setIsDragging(true); 
    lastPos.current = getPos(e); 
  };

  const handleMouseMove = (e: any) => {
    if (!isDragging || !canvasRef.current || showTutorial) return;
    const pos = getPos(e);
    const ctx = canvasRef.current.getContext('2d');
    if (ctx && lastPos.current) {
      ctx.beginPath();
      ctx.strokeStyle = '#982598';
      ctx.lineWidth = 28;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      lastPos.current = pos;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    lastPos.current = null;
    checkProgress();
  };

  const checkProgress = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let purple = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] > 100 && data[i+2] > 100) purple++;
    }
    const percent = (purple / (canvas.width * canvas.height)) * 100;
    setErasedPercent(percent * 2); // ตัวคูณเพื่อให้ผ่านง่ายขึ้น
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-[#F1E9E9] relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={grainyTexture} />

      {/* --- 1. Full-Screen Tutorial (Fixed) --- */}
      {showTutorial && (
        <div className="fixed inset-0 z-[999] bg-[#15173D] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
               style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 border-4 border-[#E491C9] rounded-full flex items-center justify-center text-white font-black text-3xl mb-8 shadow-[0_0_30px_rgba(228,145,201,0.4)]">
              {tutorialTimer}
            </div>
            <Fingerprint size={100} className="text-[#E491C9] mb-8 animate-pulse" />
            <h2 className="text-white text-5xl font-black italic mb-4 uppercase tracking-tighter leading-none">
              READY TO<br/><span className="text-[#E491C9]">SCRATCH?</span>
            </h2>
            <p className="text-white/70 text-sm font-bold uppercase tracking-widest italic max-w-xs leading-relaxed">
              ระบายทับ <span className="text-[#E491C9] underline">ชื่อและที่อยู่</span> บนกล่องพัสดุให้มิดชิดก่อนทิ้ง
            </p>
          </div>
        </div>
      )}
      
      {/* --- 2. Game Content --- */}
      <div className="flex-1 flex flex-col items-center justify-center w-full p-6 space-y-8">
        
        {/* Package Box Mockup */}
        <div className="relative w-full max-w-[300px] aspect-square flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFB347] to-[#FF8C00] rounded-[3rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3)] border-b-[12px] border-black/10 overflow-hidden transform rotate-2">
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={grainyTexture} />
            
            {/* Box Tape Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-full bg-white/10" />

            {/* Label Area (The Canvas) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[50%] bg-white rounded-xl shadow-inner border-2 border-black/5 overflow-hidden transform -rotate-2">
               <canvas 
                 ref={canvasRef} 
                 width={300} 
                 height={180} 
                 onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}
                 onTouchStart={handleMouseDown} onTouchMove={handleMouseMove} onTouchEnd={handleMouseUp}
                 className="cursor-crosshair touch-none w-full h-full" 
               />
            </div>
          </div>
        </div>

        {/* Interaction Controls */}
        <div className="flex items-center gap-10">
           <div className="hover:scale-110 transition-transform active:rotate-12">
              <PencilIcon />
           </div>
           <button 
             onClick={() => { if(!showTutorial) erasedPercent > 60 ? onWin() : onLose(); }} 
             className="transition-all hover:scale-110 active:scale-90"
           >
              <TrashIcon />
           </button>
        </div>

        {/* Information Message */}
        <div className="bg-[#15173D] px-8 py-4 rounded-2xl shadow-xl border-t border-white/10 flex items-center gap-3">
            <ShieldAlert size={18} className="text-[#E491C9]" />
            <span className="text-white font-black text-xs uppercase tracking-widest italic">
              {erasedPercent < 60 ? "ขูดทำลายข้อมูลส่วนตัว!" : "สำเร็จ! กดที่ถังขยะเพื่อทิ้ง"}
            </span>
        </div>

      </div>
    </div>
  );
};

export default Level2Package;