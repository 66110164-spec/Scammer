
import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 1
  color?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, color = "bg-[#982598]" }) => {
  return (
    <div className="w-full h-5 bg-white/40 rounded-full overflow-hidden border-2 border-[#15173D] shadow-inner">
      <div 
        className={`h-full transition-all duration-100 ease-linear ${color}`}
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
};

export default ProgressBar;
