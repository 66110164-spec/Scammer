
import React, { useState, useRef, useEffect } from 'react';

interface Level2Props {
  onWin: () => void;
  onLose: () => void;
  timeLeft: number;
}

const PencilIcon = () => (
  <svg width="85" height="85" viewBox="0 0 100 100" className="drop-shadow-lg">
    <circle cx="50" cy="50" r="48" fill="#C98BFF" />
    <path d="M50 22L38 45L62 45L50 22Z" fill="white" />
    <path d="M38 45L40 82C40 84 41 85 43 85H57C59 85 60 84 60 82L62 45H38Z" fill="#982598" />
    <line x1="46" y1="45" x2="46" y2="85" stroke="#C98BFF" strokeWidth="2" strokeLinecap="round" />
    <line x1="54" y1="45" x2="54" y2="85" stroke="#C98BFF" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const TrashIcon = () => (
  <svg width="92" height="92" viewBox="0 0 100 100" className="drop-shadow-lg">
    <circle cx="50" cy="50" r="48" fill="#C98BFF" />
    {/* Lid */}
    <path d="M30 29L45 19L70 24L60 36L30 29Z" fill="#982598" />
    {/* Bin */}
    <path d="M30 44L35 79C35 81 37 82 39 82H61C63 82 65 81 65 79L70 44H30Z" fill="#982598" />
    {/* Grid lines */}
    <line x1="40" y1="44" x2="43" y2="82" stroke="#C98BFF" strokeWidth="1.5" />
    <line x1="50" y1="44" x2="50" y2="82" stroke="#C98BFF" strokeWidth="1.5" />
    <line x1="60" y1="44" x2="57" y2="82" stroke="#C98BFF" strokeWidth="1.5" />
    <line x1="32" y1="57" x2="68" y2="57" stroke="#C98BFF" strokeWidth="1.5" />
    <line x1="34" y1="70" x2="66" y2="70" stroke="#C98BFF" strokeWidth="1.5" />
  </svg>
);

const Level2Package: React.FC<Level2Props> = ({ onWin, onLose, timeLeft }) => {
  const [erasedPercent, setErasedPercent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastPos = useRef<{ x: number, y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff'; // Label background
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#15173D';
        ctx.font = 'bold 14px Prompt';
        ctx.fillText('ส่งถึง: น.ส. ระวังตัว', 10, 30);
        ctx.fillText('เลขที่ 456 หมู่บ้านปลอดภัย', 10, 55);
        ctx.fillText('เบอร์: 09x-xxx-xxxx', 10, 80);
      }
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const pos = getPos(e);
    lastPos.current = pos;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    lastPos.current = null;
    checkErasePercent();
  };

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !canvasRef.current) return;
    const pos = getPos(e);
    const ctx = canvasRef.current.getContext('2d');
    if (ctx && lastPos.current) {
      ctx.beginPath();
      ctx.strokeStyle = '#982598'; // Purple ink
      ctx.lineWidth = 18;
      ctx.lineCap = 'round';
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      lastPos.current = pos;
    }
  };

  const checkErasePercent = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let darkPixels = 0;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (r < 160 && g < 50 && b > 140) { // Check for purple ink
        darkPixels++;
      }
    }
    const totalPixels = canvas.width * canvas.height;
    const percent = (darkPixels / (totalPixels * 0.4)) * 100;
    setErasedPercent(Math.min(100, percent));
  };

  const handleThrow = () => {
    if (erasedPercent > 75) {
      onWin();
    } else {
      onLose();
    }
  };

  useEffect(() => {
    if (timeLeft <= 0) {
      onLose();
    }
  }, [timeLeft, onLose]);

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-10 p-4">
      <div className="relative">
        <div className="w-80 h-64 bg-[#E491C9] rounded-xl shadow-2xl border-b-[12px] border-[#15173D]/30 flex flex-col items-center pt-8 overflow-hidden">
          <div className="absolute top-0 w-full h-10 bg-[#15173D]/10" />
          <div className="w-64 h-36 bg-white rounded-md border-2 border-[#15173D]/10 shadow-inner p-1 relative overflow-hidden">
            <canvas 
              ref={canvasRef}
              width={256}
              height={144}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchMove={handleMouseMove}
              onTouchEnd={handleMouseUp}
              className="cursor-crosshair touch-none"
            />
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center items-center gap-12">
         <div className="cursor-default transition-transform active:scale-95">
            <PencilIcon />
         </div>

         <button 
           onClick={handleThrow}
           className="transition-transform active:scale-90"
         >
            <TrashIcon />
         </button>
      </div>

      <div className="bg-white/40 px-6 py-2 rounded-full border-2 border-[#E491C9]">
         <span className="text-[#15173D] font-black text-sm uppercase tracking-wider italic">
           มีอะไรที่ต้องจัดการไหม?
         </span>
      </div>
    </div>
  );
};

export default Level2Package;
