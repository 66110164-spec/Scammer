
import React, { useState, useEffect } from 'react';

interface Level1Props {
  onWin: () => void;
  onLose: () => void;
  timeLeft: number;
}

const Level1Link: React.FC<Level1Props> = ({ onWin, onLose, timeLeft }) => {
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0 && !isClicked) {
      onWin();
    }
  }, [timeLeft, isClicked, onWin]);

  const handleLinkClick = () => {
    if (isClicked) return;
    setIsClicked(true);
    onLose();
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8 p-4">
      <div className="relative bg-white w-64 h-[440px] border-[10px] border-[#15173D] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col">
        {/* Phone Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-[#15173D] rounded-b-xl z-10" />
        
        {/* Content */}
        <div className="flex-1 bg-[#F1E9E9] pt-10 px-4 space-y-4">
          <div className="text-center text-[10px] text-gray-400 font-bold mb-4">วันนี้ 10:30</div>
          
          <div className="bg-[#982598] text-white p-4 rounded-2xl rounded-tl-none shadow-md relative">
            <p className="text-xs font-bold leading-relaxed">
              [แจ้งเตือน] บัญชีของคุณมีความเสี่ยง! กรุณายืนยันตัวตนทันทีเพื่อป้องกันการถูกระงับ 
              คลิก 
              <span 
                onClick={handleLinkClick}
                className="block text-[#E491C9] underline cursor-pointer hover:text-white transition-colors py-2 break-all"
              >
                https://bank-auth-security.io/v/123
              </span>
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="bg-white p-4 border-t border-gray-100">
          <div className="bg-gray-50 rounded-full py-2 px-4 text-gray-300 text-[10px] text-center border">
            ปัดขึ้นเพื่อปิด
          </div>
        </div>
      </div>
      
      <div className="bg-white/40 px-6 py-2 rounded-full border-2 border-[#E491C9]">
         <span className="text-[#15173D] font-black text-sm uppercase tracking-wider italic animate-pulse">
           คุณจะทำอย่างไร?
         </span>
      </div>
    </div>
  );
};

export default Level1Link;
