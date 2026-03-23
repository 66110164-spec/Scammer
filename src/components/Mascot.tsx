import React from 'react';

interface MascotProps {
  className?: string;
  state?: 'idle' | 'happy' | 'scared';
}

const Mascot: React.FC<MascotProps> = ({ className = "", state = 'idle' }) => {
  // ใช้ URL เดิมที่คุณมี
  const defaultImg = "https://emerald-accused-ostrich-896.mypinata.cloud/ipfs/bafybeig53qsq2wl5bl2xgzilwqahdyjy44wp4u5azz5npoabquf4btnbiq";

  return (
    <div className={`relative flex items-center justify-center overflow-hidden rounded-full ${className}`}>
      {/* วงกลมฟุ้งๆ ด้านหลัง เปลี่ยนสีตามสถานะ */}
      <div className={`absolute inset-0 opacity-20 blur-2xl rounded-full ${state === 'scared' ? 'bg-red-500' : 'bg-[#982598]'}`} />
      
      <img 
        src={defaultImg} 
        alt="Mascot"
        className={`w-full h-full object-contain relative z-10 drop-shadow-2xl ${state === 'happy' ? 'animate-bounce' : 'animate-pulse'}`}
      />
    </div>
  );
};

export default Mascot;