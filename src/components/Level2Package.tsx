import React, { useState, useRef, useEffect } from 'react';

interface Level2Props {
  onWin: () => void;
  onLose: () => void;
  timeLeft: number;
}

// Icon สำหรับปากกา
const PencilIcon = () => (
  <svg width="85" height="85" viewBox="0 0 100 100" className="drop-shadow-lg">
    <circle cx="50" cy="50" r="48" fill="#C98BFF" />
    <path d="M50 22L38 45L62 45L50 22Z" fill="white" />
    <path d="M38 45L40 82C40 84 41 85 43 85H57C59 85 60 84 60 82L62 45H38Z" fill="#982598" />
    <line x1="46" y1="45" x2="46" y2="85" stroke="#C98BFF" strokeWidth="2" strokeLinecap="round" />
    <line x1="54" y1="45" x2="54" y2="85" stroke="#C98BFF" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Icon สำหรับถังขยะ (ปุ่มส่งงาน)
const TrashIcon = () => (
  <svg width="92" height="92" viewBox="0 0 100 100" className="drop-shadow-lg">
    <circle cx="50" cy="50" r="48" fill="#C98BFF" />
    <path d="M30 29L45 19L70 24L60 36L30 29Z" fill="#982598" />
    <path d="M30 44L35 79C35 81 37 82 39 82H61C63 82 65 81 65 79L70 44H30Z" fill="#982598" />
    <line x1="40" y1="44" x2="43" y2="82" stroke="#C98BFF" strokeWidth="1.5" />
    <line x1="50" y1="44" x2="50" y2="82" stroke="#C98BFF" strokeWidth="1.5" />
    <line x1="60" y1="44" x2="57" y2="82" stroke="#C98BFF" strokeWidth="1.5" />
  </svg>
);

const Level2Package: React.FC<Level2Props> = ({ onWin, onLose, timeLeft }) => {
  const [erasedPercent, setErasedPercent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastPos = useRef<{ x: number, y: number } | null>(null);

  // วาดข้อความเริ่มต้นลงบน Label สีขาว
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff'; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#15173D';
        ctx.font = 'bold 16px Prompt';
        ctx.fillText('ส่งถึง: น.ส. ระวังตัว', 20, 40);
        ctx.font = '14px Prompt';
        ctx.fillText('เลขที่ 456 หมู่บ้านปลอดภัย', 20, 70);
        ctx.fillText('เบอร์: 09x-xxx-xxxx', 20, 100);
      }
    }
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    lastPos.current = getPos(e);
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !canvasRef.current) return;
    const pos = getPos(e);
    const ctx = canvasRef.current.getContext('2d');
    if (ctx && lastPos.current) {
      ctx.beginPath();
      ctx.strokeStyle = '#982598'; // สีปากกา (ม่วง)
      ctx.lineWidth = 20;
      ctx.lineCap = 'round';
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      lastPos.current = pos;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    lastPos.current = null;
    checkErasePercent();
  };

  const checkErasePercent = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let purplePixels = 0;
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      // ตรวจสอบว่าพิกเซลเป็นสีม่วงปากกาหรือไม่
      if (r > 100 && r < 180 && g < 80 && b > 120) {
        purplePixels++;
      }
    }
    const totalPixels = canvas.width * canvas.height;
    const percent = (purplePixels / (totalPixels * 0.45)) * 100;
    setErasedPercent(Math.min(100, percent));
  };

  const handleThrow = () => {
    // ถ้าขีดฆ่าไปมากกว่า 70% ถือว่าผ่าน
    if (erasedPercent > 70) {
      onWin();
    } else {
      onLose();
    }
  };

  useEffect(() => {
    if (timeLeft <= 0) onLose();
  }, [timeLeft, onLose]);

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8 p-4">
      
      {/* Container ของกล่องพัสดุ */}
      <div className="relative w-80 h-72 flex items-center justify-center">
        
        {/* 1. รูปภาพกล่องพัสดุ (Background) */}
        <img 
          src="/assets/images/package-box.PNG" // **ตรวจสอบชื่อไฟล์ในโฟลเดอร์ public ให้ตรงนะครับ**
          alt="Package"
          className="absolute inset-0 w-full h-full object-contain drop-shadow-2xl z-0"
          onError={(e) => {
            // ถ้าโหลดรูปไม่ขึ้น จะแสดงกล่องสีชมพูสำรองไว้
            e.currentTarget.className = "absolute inset-0 w-full h-full bg-[#E491C9] rounded-2xl z-0";
            e.currentTarget.src = ""; 
          }}
        />

        {/* 2. ส่วนของจ่าหน้าซอง (Canvas) ที่ต้องระบายทับ */}
        <div className="relative z-10 w-64 h-36 bg-white rounded shadow-inner overflow-hidden mt-4 border-2 border-black/5">
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
            className="cursor-crosshair touch-none w-full h-full"
          />
        </div>
      </div>

      {/* ส่วนควบคุม: ปากกา และ ปุ่มทิ้งลงถังขยะ */}
      <div className="w-full flex justify-center items-center gap-16">
         <div className="transition-transform hover:scale-110 active:rotate-12 cursor-pointer">
            <PencilIcon />
         </div>

         <button 
           onClick={handleThrow}
           className="transition-all hover:scale-110 active:scale-95 filter hover:brightness-110"
         >
            <TrashIcon />
         </button>
      </div>

      {/* แถบแจ้งเตือนสถานะ */}
      <div className="bg-white/60 backdrop-blur-sm px-8 py-3 rounded-full border-2 border-[#982598]/30">
          <span className="text-[#15173D] font-black text-sm uppercase tracking-widest italic">
            {erasedPercent < 70 ? "ระบายทับชื่อ-ที่อยู่ให้มิดชิด!" : "ทำลายข้อมูลเรียบร้อย ทิ้งได้!"}
          </span>
      </div>
    </div>
  );
};

export default Level2Package;