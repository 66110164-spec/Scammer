import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Banknote, Ban, Music, Info, ShieldAlert } from 'lucide-react';
import TutorialOverlay from './TutorialOverlay';

interface Props {
  onWin: () => void;
  onLose: () => void;
  timeLeft: number;
  onTutorialToggle: (isShowing: boolean) => void;
}

interface MovingButton {
  id: number;
  isCorrect: boolean;
  x: number; 
  y: number;
  vx: number;
  vy: number;
  text: string;
  isClicked: boolean;
}

const Level5MusicScam: React.FC<Props> = ({ onWin, onLose, timeLeft, onTutorialToggle }) => {
  // --- PART 1: TUTORIAL STATES ---
  const [showTutorial, setShowTutorial] = useState(true);
  const [tutorialTimer, setTutorialTimer] = useState(5);

  // --- PART 2: GAMEPLAY STATES ---
  const [buttons, setButtons] = useState<MovingButton[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(1.4);
  
  const buttonsRef = useRef<MovingButton[]>([]);
  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // ==========================================
  // LOGIC: TUTORIAL & TIME
  // ==========================================

  // จัดการการเปิด/ปิด Tutorial และการนับถอยหลัง 5 วิ
  useEffect(() => {
    if (onTutorialToggle) onTutorialToggle(showTutorial);
    
    if (showTutorial && tutorialTimer > 0) {
      const timer = setTimeout(() => setTutorialTimer(tutorialTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (tutorialTimer === 0) {
      setShowTutorial(false);
    }
  }, [tutorialTimer, showTutorial, onTutorialToggle]);

  
  // ตรวจแพ้เมื่อเวลาหลัก (Bar) หมด
  useEffect(() => {
    if (!showTutorial && timeLeft <= 0) onLose();
  }, [timeLeft, onLose, showTutorial]);

  // ==========================================
  // LOGIC: BOUNCING BUTTONS (ตามที่คุณต้องการ)
  // ==========================================

  // 1. Initial Spawn: กระจายตัวใน Safe Zone
  useEffect(() => {
    const initial: MovingButton[] = [];
    const config = [
      { t: "โอนเงินประกัน", c: false }, 
      { t: "ไม่สนใจ / ข้าม", c: true }
    ];
    let idCounter = 0;

    config.forEach(item => {
      for (let i = 0; i < 3; i++) {
        const angle = Math.random() * Math.PI * 2;
        initial.push({
          id: idCounter++,
          isCorrect: item.c,
          x: 20 + Math.random() * 60, 
          y: 30 + Math.random() * 40, 
          vx: Math.cos(angle) * 25,
          vy: Math.sin(angle) * 25,
          text: item.t,
          isClicked: false
        });
      }
    });
    buttonsRef.current = initial;
    setButtons(initial);
  }, []);

  // 2. Animation Logic: ปรับ Boundary ให้เหมาะกับขนาดปุ่มบนมือถือ
  const animate = useCallback((time: number) => {
    // หยุด Animation ถ้ายังโชว์ Tutorial
    if (showTutorial) {
      lastTimeRef.current = null;
      requestRef.current = requestAnimationFrame(animate);
      return;
    }

    if (lastTimeRef.current !== null) {
      const deltaTime = (time - lastTimeRef.current) / 1000;

      buttonsRef.current = buttonsRef.current.map(btn => {
        if (btn.isClicked) return btn;

        let nextX = btn.x + (btn.vx * currentSpeed * deltaTime);
        let nextY = btn.y + (btn.vy * currentSpeed * deltaTime);

        // BOUNDARY CALCULATIONS
        const padX = 20; 
        const padYTop = 15; 
        const padYBottom = 25; 

        if (nextX <= padX) {
          nextX = padX;
          btn.vx = Math.abs(btn.vx);
        } else if (nextX >= (100 - padX)) {
          nextX = 100 - padX;
          btn.vx = -Math.abs(btn.vx);
        }

        if (nextY <= padYTop) {
          nextY = padYTop;
          btn.vy = Math.abs(btn.vy);
        } else if (nextY >= (100 - padYBottom)) {
          nextY = 100 - padYBottom;
          btn.vy = -Math.abs(btn.vy);
        }

        return { ...btn, x: nextX, y: nextY };
      });

      setButtons([...buttonsRef.current]);
    }
    lastTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, [currentSpeed, showTutorial]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [animate]);

  const handlePress = (id: number, isCorrect: boolean) => {
    if (showTutorial) return;
    if (isCorrect) {
      const nextCount = correctCount + 1;
      setCorrectCount(nextCount);
      setCurrentSpeed(prev => prev + 0.6);
      buttonsRef.current = buttonsRef.current.map(b => b.id === id ? { ...b, isClicked: true } : b);
      if (nextCount === 3) setTimeout(() => onWin(), 300);
    } else {
      onLose();
    }
  };

  // ==========================================
  // RENDER UI
  // ==========================================
  return (
    <div className="absolute inset-0 bg-[#0F172A] overflow-hidden flex flex-col font-sans select-none z-0">
      
     
      {/* 2. Background Decor */}
      <div className="relative z-0 flex-1 flex flex-col items-center justify-center p-6 opacity-40">
        <div className="w-48 h-48 sm:w-60 sm:h-60 bg-gradient-to-tr from-[#982598] via-[#E491C9] to-[#F1E9E9] rounded-[3rem] shadow-2xl flex items-center justify-center relative border-8 border-white/5">
          <div className="absolute inset-0 bg-black/10 rounded-full scale-90 border-2 border-dashed border-white/20 animate-[spin_15s_linear_infinite]" />
          <Music size={50} className="text-white fill-white" />
        </div>
      </div>

      {/* 3. Gameplay Layer (ปุ่มจะโชว์เมื่อ Tutorial จบ) */}
      {!showTutorial && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {buttons.map(btn => !btn.isClicked && (
            <button
              key={btn.id}
              onClick={(e) => { e.stopPropagation(); handlePress(btn.id, btn.isCorrect); }}
              style={{ 
                position: 'absolute', left: `${btn.x}%`, top: `${btn.y}%`,
                transform: `translate(-50%, -50%)`, willChange: 'left, top',
              }}
              className={`pointer-events-auto absolute min-w-[150px] whitespace-nowrap py-3 px-5 rounded-full font-black uppercase italic text-[11px] transition-transform active:scale-90 border-b-4
                ${btn.isCorrect ? "bg-white text-[#0F172A] border-gray-300 shadow-xl" : "bg-[#F43F5E] text-white border-[#9F1239] shadow-lg"}`}
            >
              <div className="flex items-center justify-center gap-2">
                {btn.isCorrect ? <Ban size={14} /> : <Banknote size={14} />}
                {btn.text}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* 4. Top UI Bar */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20 pointer-events-none">
        <button onClick={() => setShowTutorial(true)} className="p-2 bg-white/10 rounded-full text-white pointer-events-auto active:scale-90">
          <Info size={24} />
        </button>
        <div className="bg-[#E491C9] px-4 py-1.5 rounded-full text-[#0F172A] font-black text-[10px] italic shadow-lg">
          TEMPO: {currentSpeed.toFixed(1)}X
        </div>
      </div>

      {/* 5. Bottom UI Bar (Progress Bar เดินตาม timeLeft) */}
      <div className="absolute bottom-0 left-0 right-0 p-8 pb-10 z-20">
        <div className="flex justify-between mb-2 items-end">
          <div className="flex items-center gap-2 opacity-30 text-white">
            <ShieldAlert size={14} />
            <span className="text-[9px] font-black uppercase tracking-tighter">Verified Progress</span>
          </div>
          <p className="text-white font-black text-xl italic">{correctCount}<span className="text-[#E491C9]">/3</span></p>
        </div>
        <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden border border-white/5">
          {/* Progress Bar สีชมพู (ไม่มีตัวเลขเวลา) */}
          <div 
            className="h-full bg-[#E491C9] shadow-[0_0_15px_#E491C9] transition-all duration-1000 ease-linear" 
            style={{ width: `${(timeLeft / 15) * 100}%` }} 
          />
        </div>
         {/* 1. Tutorial Overlay (Full-Screen ART Style) */}
      <TutorialOverlay 
        isVisible={showTutorial}
        timer={tutorialTimer}
        icon={Music}
        titleTop="MUSIC"
        titleBottom="SCAM"
        subText="อย่าโอนเงินประกันเพื่อแลกกับงานฟังเพลง"
      />

      </div>
    </div>
  );
};

export default Level5MusicScam;