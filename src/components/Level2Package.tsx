import React, { useState, useRef, useEffect } from 'react';

interface Level2Props {
  onWin: () => void;
  onLose: () => void;
  timeLeft: number;
  onTutorialToggle?: (isShowing: boolean) => void;
}

// --- Pencil Icon: อัปเกรดให้ดูเหมือนปากกา Marker จริงๆ ---
// --- Pencil Icon: ปรับโฉมเป็น Marker หัวตัดสุดเท่ ---
const PencilIcon = () => (
  <div className="group relative w-24 h-24 flex items-center justify-center">
    {/* รัศมีเรืองแสงด้านหลัง (Glow) */}
    <div className="absolute inset-0 bg-[#C98BFF] rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
    
    {/* ตัวฐานวงกลมสไตล์ 3D */}
    <div className="relative w-20 h-20 bg-gradient-to-b from-[#C98BFF] to-[#982598] rounded-full shadow-[0_8px_0_0_#6A1B6A,0_15px_20px_rgba(0,0,0,0.3)] flex items-center justify-center border-2 border-white/20 overflow-hidden active:translate-y-[4px] active:shadow-[0_4px_0_0_#6A1B6A,0_10px_15px_rgba(0,0,0,0.3)] transition-all">
      
      {/* Texture เกรน */}
      <div className="absolute inset-0 opacity-30 pointer-events-none" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Cfilter id='n'%3%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3'/%3%3C/filter%3%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3%3C/svg%3%3E")` }} 
      />

      {/* ตัวปากกา Marker (วาดด้วย SVG ทั้งหมดเพื่อเลี่ยง Error) */}
      <div className="relative z-10 rotate-[-15deg] group-hover:rotate-0 transition-transform duration-300 scale-110">
        <svg width="40" height="60" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* หัวปากกาหัวตัด (Nib) */}
          <path d="M12 5L28 5L32 15L8 15L12 5Z" fill="#711A71" />
          <path d="M12 5L20 5L22 15L10 15L12 5Z" fill="#982598" /> {/* Highlight หัวปากกา */}
          
          {/* คอพลาสติก */}
          <rect x="6" y="15" width="28" height="6" rx="1" fill="#D1D5DB" />
          
          {/* ด้ามปากกา */}
          <rect x="4" y="21" width="32" height="35" rx="4" fill="#15173D" />
          
          {/* แถบสีบนด้าม */}
          <rect x="4" y="28" width="32" height="10" fill="#E491C9" fillOpacity="0.8" />
          
          {/* เงาสะท้อนข้างด้าม */}
          <rect x="28" y="21" width="4" height="35" fill="white" fillOpacity="0.1" />
        </svg>
      </div>

      {/* แสง Highlight ด้านบนวงกลม */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-12 h-6 bg-white/20 rounded-full blur-sm" />
    </div>
  </div>
);

// --- Trash Icon: อัปเกรดให้ดูมีมิติ (Depth) ---
const TrashIcon = () => (
  <div className="group relative w-24 h-24 flex items-center justify-center">
    {/* ตัวฐานปุ่มสี่เหลี่ยมมุมมน (Squircle) */}
    <div className="relative w-20 h-20 bg-gradient-to-b from-[#4A4E91] to-[#15173D] rounded-[2rem] shadow-[0_8px_0_0_#0D0E25,0_15px_25px_rgba(0,0,0,0.4)] flex items-center justify-center border-2 border-white/10 overflow-hidden">
      
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Cfilter id='n'%3%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3'/%3%3C/filter%3%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3%3C/svg%3%3E")` }} 
      />

      {/* กราฟิกถังขยะ */}
      <div className="relative z-10 flex flex-col items-center group-hover:scale-110 transition-transform">
        {/* ฝาถังขยะแบบมีที่จับ */}
        <div className="w-10 h-1.5 bg-[#E491C9] rounded-full relative mb-0.5 shadow-sm">
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-4 h-1.5 bg-[#E491C9] rounded-t-full" />
        </div>
        {/* ตัวถังขยะลายทาง */}
        <div className="w-9 h-10 bg-white rounded-b-md p-1.5 flex justify-around shadow-inner">
          <div className="w-1 h-full bg-gray-200 rounded-full" />
          <div className="w-1 h-full bg-gray-200 rounded-full" />
          <div className="w-1 h-full bg-gray-200 rounded-full" />
        </div>
      </div>

      {/* แสงเงาด้านข้าง */}
      <div className="absolute right-0 top-0 h-full w-1/2 bg-black/5" />
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
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3%3Cfilter id='f'%3%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3%3C/filter%3%3Crect width='100%25' height='100%25' filter='url(%23f)'/%3%3C/svg%3%3E")`,
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
        ctx.fillStyle = '#F3F4F6'; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#111827';
        ctx.font = 'bold 16px Prompt';
        ctx.fillText('นาย จอมยุทธ์ เบอร์โทร 1441', 15, 45); 
        ctx.font = '14px Prompt';
        ctx.fillText('บ้านเลขที่ 14 หมู่ 67 จังหวัด ระยอง', 15, 80);
      }
    }
  }, []);

  const getPos = (e: any) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (256 / rect.width),
      y: (clientY - rect.top) * (144 / rect.height)
    };
  };

  // แก้ Error 'ctx' โดยการดึง context ภายในฟังก์ชันให้ถูกต้อง
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
      ctx.lineWidth = 24; // ปรับให้หนาขึ้นหน่อยเพื่อความสะใจ
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
      if (data[i] > 120 && data[i+2] > 120) purple++;
    }
    setErasedPercent((purple / (canvas.width * canvas.height * 0.45)) * 100);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8 p-4 bg-gradient-to-b from-[#F1E9E9] to-[#E491C9]/30 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={grainyTexture} />

      {/* Tutorial Overlay */}
      {showTutorial && (
        <div className="absolute inset-0 z-50 bg-[#15173D]/95 backdrop-blur-sm flex flex-col items-center justify-center transition-all duration-500">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={grainyTexture} />
          <div className="absolute top-10 right-10 w-16 h-16 border-4 border-[#E491C9] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(228,145,201,0.6)]">
            <span className="text-white font-black text-2xl">{tutorialTimer}</span>
          </div>
          <div className="mb-6 animate-bounce text-[#E491C9]">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" /><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" /><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
              <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
            </svg>
          </div>
          <h2 className="text-white text-4xl font-black mb-3 italic tracking-tighter uppercase">READY TO SCRATCH?</h2>
          <p className="text-white/80 text-center px-12 text-lg font-medium leading-relaxed">
            ระบายทับ <span className="text-[#E491C9] font-bold underline">ชื่อ-ที่อยู่</span> ให้มิดชิด<br/>
            ก่อนเวลาหัวหมูจะหมดลง!
          </p>
        </div>
      )}
      
      {/* Main Game Content */}
      <div className="relative w-80 h-80 flex items-center justify-center">
        {/* กล่องพัสดุจำลอง */}
        <div className="absolute w-72 h-72 bg-gradient-to-br from-[#FFB347] to-[#FF8C00] rounded-[3rem] shadow-[0_20px_40px_rgba(0,0,0,0.2)] overflow-hidden border-b-8 border-black/10">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={grainyTexture} />
          {/* Label Area */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-60 h-36 bg-white rounded-2xl shadow-inner border-2 border-black/5 overflow-hidden">
             <canvas 
               ref={canvasRef} width={256} height={144} 
               onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}
               onTouchStart={handleMouseDown} onTouchMove={handleMouseMove} onTouchEnd={handleMouseUp}
               className="cursor-crosshair touch-none w-full h-full" 
             />
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center items-center gap-10 z-10">
         <div className="hover:scale-110 transition-transform active:rotate-6">
            <PencilIcon />
         </div>
         <button 
           onClick={() => { if(!showTutorial) erasedPercent > 70 ? onWin() : onLose(); }} 
           className="transition-all hover:scale-110 active:scale-90"
         >
            <TrashIcon />
         </button>
      </div>

      <div className="bg-[#15173D] px-10 py-4 rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.15)] border-t border-white/10">
          <span className="text-[#E491C9] font-black text-sm uppercase tracking-widest italic">
            {erasedPercent < 70 ? "ระบายทับข้อมูลให้มิดชิด!" : "ทำลายข้อมูลสำเร็จ! ทิ้งลงถังเลย"}
          </span>
      </div>
    </div>
  );
};

export default Level2Package;