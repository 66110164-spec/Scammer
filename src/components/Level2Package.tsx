import React, { useState, useRef, useEffect } from 'react';

interface Level2Props {
  onWin: () => void;
  onLose: () => void;
  timeLeft: number;
  onTutorialToggle?: (isShowing: boolean) => void;
}

// --- Pencil Icon Custom Style ---
const PencilIcon = () => (
  <div className="w-20 h-20 bg-gradient-to-tr from-[#982598] to-[#C98BFF] rounded-full flex items-center justify-center shadow-lg border-2 border-white/30 relative overflow-hidden">
    {/* Noise Layer */}
    <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Cfilter id='n'%3%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3'/%3%3C/filter%3%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3%3C/svg%3%3E")` }} />
    <svg width="45" height="45" viewBox="0 0 100 100" className="relative z-10">
      <path d="M50 22L38 45L62 45L50 22Z" fill="white" />
      <path d="M38 45L40 82C40 84 41 85 43 85H57C59 85 60 84 60 82L62 45H38Z" fill="rgba(255,255,255,0.8)" />
    </svg>
  </div>
);

const TrashIcon = () => (
  <div className="w-24 h-24 bg-gradient-to-br from-[#15173D] to-[#982598] rounded-full flex items-center justify-center shadow-xl border-4 border-white/20 relative overflow-hidden">
    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Cfilter id='n'%3%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3'/%3%3C/filter%3%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3%3C/svg%3%3E")` }} />
    <svg width="50" height="50" viewBox="0 0 100 100" className="relative z-10">
      <path d="M30 29L45 19L70 24L60 36L30 29Z" fill="white" />
      <path d="M30 44L35 79C35 81 37 82 39 82H61C63 82 65 81 65 79L70 44H30Z" fill="rgba(255,255,255,0.9)" />
    </svg>
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

  // Canvas Setup: จำลองข้อความบนกล่องพัสดุ
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#E5E7EB'; // สีพื้นหลังป้ายชื่อจางๆ
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#1F2937';
        ctx.font = 'bold 16px Prompt';
        ctx.fillText('นาย จอมยุทธ์ เบอร์โทร 1441', 15, 45); // อิงข้อความจากรูป
        ctx.font = '14px Prompt';
        ctx.fillText('บ้านเลขที่ 14 หมู่ 67 จังหวัด ระยอง', 15, 80);
      }
    }
  }, []);

  // --- Drawing Logic ---
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

  const handleMouseDown = (e: any) => { if (!showTutorial) { setIsDragging(true); lastPos.current = getPos(e); } };
  const handleMouseMove = (e: any) => {
    if (!isDragging || !canvasRef.current || showTutorial) return;
    const pos = getPos(e);
    const ctx = canvasRef.current.getContext('2d');
    if (ctx && lastPos.current) {
      ctx.beginPath();
      ctx.strokeStyle = '#982598';
      ctx.lineWidth = 22;
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
    const canvas = canvasRef.current;
    if (!canvas) return;
    const data = canvas.getContext('2d')?.getImageData(0, 0, canvas.width, canvas.height).data;
    if (!data) return;
    let purple = 0;
    for (let i = 0; i < data.length; i += 4) if (data[i] > 100 && data[i+2] > 100) purple++;
    setErasedPercent((purple / (canvas.width * canvas.height * 0.45)) * 100);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8 p-4 bg-gradient-to-b from-[#F1E9E9] to-[#E491C9]/30 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={grainyTexture} />

      {/* Tutorial Overlay */}
      {showTutorial && (
        <div className="absolute inset-0 z-50 bg-[#15173D]/95 backdrop-blur-sm flex flex-col items-center justify-center transition-all">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={grainyTexture} />
          <div className="absolute top-10 right-10 w-14 h-14 border-4 border-[#E491C9] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(228,145,201,0.5)]">
            <span className="text-white font-black text-2xl">{tutorialTimer}</span>
          </div>
          <div className="mb-6 animate-bounce text-[#E491C9]">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" /><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" /><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
              <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
            </svg>
          </div>
          <h2 className="text-white text-4xl font-black mb-3 italic tracking-tighter uppercase">GET READY!</h2>
          <p className="text-white/80 text-center px-12 text-lg font-medium leading-relaxed">
            ใช้ <span className="text-[#E491C9] font-bold underline">ปากกาเวทมนตร์</span> ระบายทับ<br/>
            ข้อมูลส่วนตัวบนกล่องให้มิดชิด!
          </p>
        </div>
      )}

      {/* Main Game Content */}
      <div className="relative w-80 h-80 flex items-center justify-center">
        {/* กล่องพัสดุจำลองสไตล์ Grainy Gradient อิงจากรูป */}
        <div className="absolute w-72 h-72 bg-gradient-to-br from-[#FFB347] to-[#FF8C00] rounded-[2.5rem] shadow-[15px_15px_0px_rgba(0,0,0,0.1)] overflow-hidden border-4 border-[#15173D]/10">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={grainyTexture} />
          {/* Label Area */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-60 h-32 bg-white/90 backdrop-blur-sm rounded-2xl shadow-inner border-2 border-black/5 overflow-hidden">
             <canvas 
               ref={canvasRef} width={256} height={144} 
               onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}
               onTouchStart={handleMouseDown} onTouchMove={handleMouseMove} onTouchEnd={handleMouseUp}
               className="cursor-crosshair touch-none w-full h-full" 
             />
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center items-center gap-12 z-10">
         <button className="transition-transform hover:scale-110 active:rotate-12"><PencilIcon /></button>
         <button onClick={() => { if(!showTutorial) erasedPercent > 70 ? onWin() : onLose(); }} className="transition-all hover:scale-110 active:scale-95"><TrashIcon /></button>
      </div>

      <div className="bg-white/40 backdrop-blur-md px-10 py-3 rounded-full border-2 border-[#982598]/20 shadow-lg">
          <span className="text-[#15173D] font-black text-sm uppercase tracking-widest italic">
            {erasedPercent < 70 ? "ระบายทับข้อมูลให้มิดชิด!" : "ทำลายข้อมูลสำเร็จ! ทิ้งลงถังเลย"}
          </span>
      </div>
    </div>
  );
};

export default Level2Package;