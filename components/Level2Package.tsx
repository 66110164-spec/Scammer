
import React, { useState, useRef, useEffect } from 'react';
import { Trash2, PenTool } from 'lucide-react';

interface Level2Props {
  onWin: () => void;
  onLose: () => void;
  timeLeft: number;
}

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

      <div className="w-full flex justify-center items-center gap-8">
         <div className="bg-[#982598]/10 p-4 rounded-full border-4 border-[#982598] shadow-lg cursor-default">
            <PenTool size={32} className="text-[#982598]" />
         </div>

         <button 
           onClick={handleThrow}
           className="group bg-[#15173D] hover:bg-[#982598] p-6 rounded-full border-4 border-white shadow-xl transition-all active:scale-90"
         >
            <Trash2 size={48} className="text-white" />
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
