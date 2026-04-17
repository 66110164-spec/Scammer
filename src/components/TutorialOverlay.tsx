import React from 'react';
import { LucideIcon } from 'lucide-react';

interface TutorialProps {
  isVisible: boolean;
  timer: number;
  titleTop: string;    // คำบรรทัดบน (เช่น STRANGER)
  titleBottom: string; // คำบรรทัดล่าง (เช่น DANGER)
  subText: string;     // คำอธิบายเล็กๆ ด้านล่าง
  icon: LucideIcon;
}

const TutorialOverlay: React.FC<TutorialProps> = ({ 
  isVisible, timer, titleTop, titleBottom, subText, icon: Icon 
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-[#15173D] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
      {/* Noise Effect Background (สไตล์ ART แบบด่าน 4) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />
      
      <div className="relative z-10 flex flex-col items-center">
        {/* วงกลมเวลานับถอยหลัง */}
        <div className="w-20 h-20 border-4 border-[#E491C9] rounded-full flex items-center justify-center text-[#F1E9E9] font-black text-3xl mb-8 shadow-[0_0_20px_rgba(228,145,201,0.5)]">
          {timer}
        </div>

        {/* Main Icon */}
        <Icon size={100} className="text-[#E491C9] mb-8" />

        {/* Header Style (ตัวหนา เอียง ใหญ่) */}
        <h2 className="text-[#F1E9E9] text-5xl font-black italic mb-4 leading-[0.9] uppercase tracking-tighter">
          {titleTop}<br/>
          <span className="text-[#E491C9]">{titleBottom}</span>
        </h2>

        {/* Subtext */}
        <p className="text-[#F1E9E9]/50 text-xs font-bold uppercase tracking-widest italic mt-4">
          {subText}
        </p>
      </div>
    </div>
  );
};

export default TutorialOverlay;