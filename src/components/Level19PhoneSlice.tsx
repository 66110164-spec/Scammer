import React, { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';
import TutorialOverlay from './TutorialOverlay';

interface Props {
  onWin: () => void;
  onLose: () => void;
  timeLeft: number;
  onTutorialToggle: (isShowing: boolean) => void;
  onRetry: () => void; // เพิ่มฟังก์ชันให้กดเริ่มใหม่
}

const Level19PhoneSliceClick: React.FC<Props> = ({ onWin, onLose, timeLeft, onTutorialToggle }) => {
  const [showTutorial, setShowTutorial] = useState(true);
  const [tutorialTimer, setTutorialTimer] = useState(5);
  
  const [items, setItems] = useState([
    { id: 1, x: 20, y: 110, text: '081-234-5678', isFalling: false },
    { id: 2, x: 50, y: 130, text: '099-876-5432', isFalling: false },
    { id: 3, x: 80, y: 150, text: '062-111-2233', isFalling: false },
  ]);
  
  // นับถอยหลัง Tutorial
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

  // Game Loop
  useEffect(() => {
    if (showTutorial) return;

    let animationFrameId: number;

    const gameLoop = () => {
      setItems(prev => {
        const next = prev.map(item => {
          // ถ้ายังไม่ตก ให้ลอยขึ้นไป (y ลดลง)
          if (!item.isFalling) return { ...item, y: item.y - 0.5 };
          // ถ้าตกแล้ว ให้หล่นลงมา (y เพิ่มขึ้น)
          return { ...item, y: item.y + 5 }; 
        });

        // แพ้ถ้ามีอันไหนลอยพ้นจอไปโดยที่ยังไม่ถูกกด
        if (next.some(item => !item.isFalling && item.y < -10)) {
            onLose();
        }
        return next;
      });
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [showTutorial, onLose]);

  // กดเพื่อทำลาย
  const handleClick = (id: number) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, isFalling: true } : item
    ));
  };

  // เช็คเงื่อนไขชนะ (เมื่อทุกอันถูกกดตกไปหมดแล้ว)
  useEffect(() => {
    if (items.length > 0 && items.every(i => i.isFalling)) {
      setTimeout(() => onWin(), 500);
    }
  }, [items, onWin]);

  return (
    <div className="absolute inset-0 bg-gray-100 overflow-hidden touch-none">
      {items.map(item => (
        <div 
          key={item.id}
          onClick={() => handleClick(item.id)}
          // ใช้วิธีเปลี่ยนสไตล์ตามสถานะ isFalling
          className={`absolute px-4 py-3 rounded shadow-lg border border-gray-300 flex items-center gap-3 cursor-pointer z-10 select-none
            ${item.isFalling ? 'opacity-0 scale-50 rotate-[30deg] transition-all duration-500 ease-in' : 'bg-yellow-50'}`}
          style={{ 
            left: `${item.x}%`, 
            top: `${item.y}%`, 
            transform: 'translate(-50%, -50%)',
            transition: item.isFalling ? 'all 0.5s ease-in' : 'none' // ใส่ transition เฉพาะตอนร่วง
          }}
        >
          <Phone size={20} className="text-rose-600" />
          <span className="text-gray-900 font-mono font-bold text-lg">{item.text}</span>
        </div>
      ))}

      <div className="absolute top-8 left-0 right-0 text-center pointer-events-none">
        <h2 className="text-rose-600 font-black text-2xl uppercase tracking-widest">TAP TO DELETE!</h2>
      </div>

      <TutorialOverlay 
        isVisible={showTutorial} 
        timer={tutorialTimer} 
        icon={Phone} 
        titleTop="CLICK" 
        titleBottom="SCAMS" 
        subText="มิจฉาชีพกำลังแฝงตัวมา! คลิกที่เบอร์โทรศัพท์เพื่อทำลายทิ้งให้หมด!" 
      />
    </div>
  );
};

export default Level19PhoneSliceClick;