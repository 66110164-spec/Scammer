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

  // ==========================================
  // [ส่วนเพิ่มใหม่] CSS Inline Style สำหรับ Noise Texture
  // คุณสามารถปรับค่า opacity (0.05) เพื่อคุมความชัดของเกรนได้ครับ
  // ==========================================
  const grainyTexture = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3%3Cfilter id='noiseFilter'%3%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3%3C/filter%3%3CfeColorMatrix type='matrix' values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.5 0'/%3%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3%3C/svg%3%3E")`,
    opacity: 0.1, // ความเข้มของเกรน (0-1)
  };

  return (
    // เปลี่ยนพื้นหลังหลักให้เป็น Gradient สีครีม-ชมพูอ่อน
    <div className="flex flex-col items-center justify-center h-full space-y-8 p-4 bg-gradient-to-br from-[#F1E9E9] to-[#E491C9]/20 relative overflow-hidden">
     
      {/* [เพิ่มใหม่] ชั้น Noise Texture ทับพื้นหลังหลัก */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={grainyTexture}></div>

      {/* --- ตัวโทรศัพท์ --- */}
      {/* ปรับสีขอบให้ซอฟต์ลง และเพิ่ม Drop Shadow ฟุ้งๆ */}
      <div className="relative bg-white/90 backdrop-blur-sm w-64 h-[440px] border-[10px] border-[#15173D]/90 rounded-[3rem] shadow-[0_20px_50px_-10px_rgba(152,37,152,0.3)] overflow-hidden flex flex-col z-10">
       
        {/* Phone Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-[#15173D]/90 rounded-b-xl z-10" />
       
        {/* Content */}
        <div className="flex-1 bg-[#F1E9E9]/50 pt-10 px-4 space-y-4 relative">
         
          {/* [เพิ่มใหม่] Noise Texture เฉพาะข้างในหน้าจอโทรศัพท์ */}
          <div className="absolute inset-0 z-0 opacity-5 pointer-events-none" style={grainyTexture}></div>

          <div className="relative z-10">
            <div className="text-center text-[10px] text-gray-400 font-bold mb-4">วันนี้ 10:30</div>
           
            {/* --- กล่องข้อความ (SMS Bubble) --- */}
            {/* เปลี่ยนสีพื้นหลังเป็น Gradient สีม่วง-ชมพู พร้อมใส่เกรน */}
            <div className="bg-gradient-to-br from-[#982598] to-[#E491C9] text-white p-5 rounded-3xl rounded-tl-none shadow-lg relative overflow-hidden border border-white/20">
             
              {/* [เพิ่มใหม่] Noise Texture ข้างในกล่องข้อความ */}
              <div className="absolute inset-0 z-0 opacity-15 pointer-events-none" style={grainyTexture}></div>

              <p className="relative z-10 text-xs font-bold leading-relaxed">
                [แจ้งเตือน] บัญชีของคุณมีความเสี่ยง! กรุณายืนยันตัวตนทันทีเพื่อป้องกันการถูกระงับ
                <span className="block mt-3 text-white/70">คลิก</span>
                <span
                  onClick={handleLinkClick}
                  className="block text-white underline cursor-pointer hover:text-[#15173D] transition-colors py-2 break-all font-mono bg-black/10 px-2 rounded mt-1"
                >
                  https://bank-auth-security.io/v/123
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="bg-white p-4 border-t border-gray-100/50 z-10">
          <div className="bg-gray-100 rounded-full py-2 px-4 text-gray-400 text-[10px] text-center border border-gray-200/50 font-bold">
            ปัดขึ้นเพื่อปิด
          </div>
        </div>
      </div>
     
      {/* --- แถบคำถามด้านล่าง --- */}
      {/* ปรับให้เป็น Glassmorphism (ใสๆ ฟุ้งๆ) */}
      <div className="bg-white/50 backdrop-blur-md px-8 py-3 rounded-full border border-white/20 shadow-lg z-10">
         <span className="text-[#15173D] font-black text-sm uppercase tracking-widest italic animate-pulse">
            คุณจะทำอย่างไร?
         </span>
      </div>
    </div>
  );
};

export default Level1Link;