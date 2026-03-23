import React, { useState, useRef, useEffect } from 'react';

interface Level2Props {
  onWin: () => void;
  onLose: () => void;
  timeLeft: number;
  // [เพิ่มมาจากระบบคำใบ้] Prop สำหรับส่งค่าไปบอก App.tsx ให้หยุด/เดินเวลาหลัก
  onTutorialToggle?: (isShowing: boolean) => void;
}

// --- Icons ---
const PencilIcon = () => (
  <svg width="85" height="85" viewBox="0 0 100 100" className="drop-shadow-lg">
    <circle cx="50" cy="50" r="48" fill="#C98BFF" />
    <path d="M50 22L38 45L62 45L50 22Z" fill="white" />
    <path d="M38 45L40 82C40 84 41 85 43 85H57C59 85 60 84 60 82L62 45H38Z" fill="#982598" />
  </svg>
);

const TrashIcon = () => (
  <svg width="92" height="92" viewBox="0 0 100 100" className="drop-shadow-lg">
    <circle cx="50" cy="50" r="48" fill="#C98BFF" />
    <path d="M30 29L45 19L70 24L60 36L30 29Z" fill="#982598" />
    <path d="M30 44L35 79C35 81 37 82 39 82H61C63 82 65 81 65 79L70 44H30Z" fill="#982598" />
  </svg>
);

const Level2Package: React.FC<Level2Props> = ({ onWin, onLose, timeLeft, onTutorialToggle }) => {
  const [erasedPercent, setErasedPercent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  // ==========================================
  // [เพิ่มมาจากระบบคำใบ้] State คุมการแสดงผลและเวลานับถอยหลังของคำใบ้
  // ==========================================
  const [showTutorial, setShowTutorial] = useState(true);
  const [tutorialTimer, setTutorialTimer] = useState(5); 

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastPos = useRef<{ x: number, y: number } | null>(null);

  // ==========================================
  // [เพิ่มมาจากระบบคำใบ้] แจ้ง App.tsx ให้หยุดเวลาทันทีที่เข้าด่าน
  // ==========================================
  useEffect(() => {
    if (onTutorialToggle) onTutorialToggle(true);
  }, [onTutorialToggle]);

  // ==========================================
  // [เพิ่มมาจากระบบคำใบ้] useEffect นับถอยหลัง 5 วิ สำหรับหน้าคำใบ้
  // ==========================================
  useEffect(() => {
    if (showTutorial && tutorialTimer > 0) {
      const timer = setTimeout(() => setTutorialTimer(tutorialTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (tutorialTimer === 0) {
      setShowTutorial(false);
      // [เพิ่มมาจากระบบคำใบ้] บอก App.tsx ให้เริ่มเดินเวลาหลัก (หัวหมูขยับ)
      if (onTutorialToggle) onTutorialToggle(false);
    }
  }, [tutorialTimer, showTutorial, onTutorialToggle]);

  // Setup Canvas เริ่มต้น (วาดจ่าหน้าซอง)
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

  // --- Logic การวาด (คงเดิม) ---
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
    if (showTutorial) return;
    setIsDragging(true);
    lastPos.current = getPos(e);
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !canvasRef.current || showTutorial) return;
    const pos = getPos(e);
    const ctx = canvasRef.current.getContext('2d');
    if (ctx && lastPos.current) {
      ctx.beginPath();
      ctx.strokeStyle = '#982598';
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
      const r = data[i], g = data[i+1], b = data[i+2];
      if (r > 100 && r < 180 && g < 80 && b > 120) purplePixels++;
    }
    const percent = (purplePixels / (canvas.width * canvas.height * 0.45)) * 100;
    setErasedPercent(Math.min(100, percent));
  };

  const handleThrow = () => {
    if (showTutorial) return;
    if (erasedPercent > 70) onWin(); else onLose();
  };

  useEffect(() => {
    if (!showTutorial && timeLeft <= 0) {
      onLose();
    }
  }, [timeLeft, onLose, showTutorial]);

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8 p-4 relative overflow-hidden">
      
      {/* ========================================== */}
      {/* [เพิ่มมาจากระบบคำใบ้] Tutorial Overlay */}
      {/* ========================================== */}
      {showTutorial && (
        <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center transition-all duration-500">
          
          {/* เลขนับถอยหลังวงกลมมุมขวา */}
          <div className="absolute top-10 right-10 w-12 h-12 border-4 border-[#E491C9] rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">{tutorialTimer}</span>
          </div>

          <div className="mb-6 animate-bounce">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#E491C9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
              <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
              <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
              <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
            </svg>
          </div>
          
          <h2 className="text-white text-4xl font-black mb-3 italic tracking-tighter uppercase text-center">
            Ready to SCRATCH?
          </h2>
          
          <p className="text-white/90 text-center px-10 text-lg font-medium leading-relaxed">
            ระบายทับ <span className="text-[#E491C9] font-bold">ชื่อ-ที่อยู่</span> ให้มิดชิด<br/>
            ก่อนเวลาหัวหมูจะหมดลง!
          </p>

          {/* แถบ Progress Bar เล็กๆ ด้านล่างคำใบ้ */}
          <div className="mt-8 flex gap-2">
             {[...Array(5)].map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 w-8 rounded-full transition-all duration-300 ${i < tutorialTimer ? 'bg-white/20' : 'bg-[#E491C9]'}`} 
                />
             ))}
          </div>
        </div>
      )}

      {/* --- ตัวเกมหลัก --- */}
      <div className="relative w-80 h-72 flex items-center justify-center">
        <img 
          src="/assets/images/package-box.PNG" 
          alt="Package" 
          className="absolute inset-0 w-full h-full object-contain drop-shadow-2xl z-0" 
        />
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

      <div className="w-full flex justify-center items-center gap-16">
         <div className="cursor-pointer transition-transform hover:scale-110 active:rotate-12">
            <PencilIcon />
         </div>
         <button onClick={handleThrow} className="transition-all hover:scale-110 active:scale-95">
            <TrashIcon />
         </button>
      </div>

      <div className="bg-white/60 backdrop-blur-sm px-8 py-3 rounded-full border-2 border-[#982598]/30">
          <span className="text-[#15173D] font-black text-sm uppercase tracking-widest italic">
            {erasedPercent < 70 ? "ระบายทับชื่อ-ที่อยู่ให้มิดชิด!" : "ทำลายข้อมูลเรียบร้อย ทิ้งได้!"}
          </span>
      </div>
    </div>
  );
};

export default Level2Package;