
import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 1
  color?: string;
}

const MascotHead = () => (
  <svg width="44" height="44" viewBox="0 0 100 100" className="drop-shadow-md">
    {/* Ears */}
    <path d="M15 40 Q5 15 35 10 Q45 10 45 35 L40 45 Z" fill="#FFB7E3" stroke="#FF80C5" strokeWidth="3" />
    <path d="M85 40 Q95 15 65 10 Q55 10 55 35 L60 45 Z" fill="#FFB7E3" stroke="#FF80C5" strokeWidth="3" />
    
    {/* Furry Head - Irregular shape */}
    <path d="M50 25 
      C 60 25, 70 30, 75 40 
      C 85 45, 90 55, 85 70 
      C 80 85, 65 95, 50 95 
      C 35 95, 20 85, 15 70 
      C 10 55, 15 45, 25 40 
      C 30 30, 40 25, 50 25" 
      fill="#E0E0E0" stroke="#A0A0A0" strokeWidth="1" />
    
    {/* Mask */}
    <path d="M28 52 Q50 42 72 52 Q75 65 50 78 Q25 65 28 52" fill="#333" />
    
    {/* Eyes - Angry/Sharp */}
    <path d="M38 55 L46 52 L44 58 Z" fill="white" />
    <path d="M62 55 L54 52 L56 58 Z" fill="white" />
    
    {/* Nose - Pig like */}
    <ellipse cx="50" cy="68" rx="12" ry="10" fill="#FFB7E3" stroke="#FF80C5" strokeWidth="2" />
    <circle cx="46" cy="68" r="2.5" fill="#FF80C5" />
    <circle cx="54" cy="68" r="2.5" fill="#FF80C5" />
    
    {/* Stress/Sweat lines */}
    <path d="M75 35 Q80 30 85 35" fill="none" stroke="#333" strokeWidth="1" />
    <path d="M78 40 Q83 35 88 40" fill="none" stroke="#333" strokeWidth="1" />
    
    {/* Mouth - Sharp teeth */}
    <path d="M35 75 Q50 85 65 75" fill="none" stroke="#333" strokeWidth="2" />
    <path d="M40 76 L42 80 L44 77 M48 78 L50 82 L52 79 M56 77 L58 81 L60 76" fill="none" stroke="#333" strokeWidth="1.5" />
  </svg>
);

const RightBox = () => (
  <svg width="44" height="44" viewBox="0 0 60 55">
    {/* Hand-drawn rounded box */}
    <path d="M8 12 C 8 6, 12 4, 30 4 C 48 4, 52 6, 52 12 L 54 42 C 54 48, 48 52, 30 52 C 12 52, 6 48, 6 42 Z" 
      fill="#C98BFF" stroke="#982598" strokeWidth="5" />
    {/* Three lines */}
    <path d="M18 20 Q30 18 42 20" fill="none" stroke="#982598" strokeWidth="4" strokeLinecap="round" />
    <path d="M18 30 Q30 28 42 30" fill="none" stroke="#982598" strokeWidth="4" strokeLinecap="round" />
    <path d="M18 40 Q30 38 42 40" fill="none" stroke="#982598" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="flex items-center gap-6 w-full max-w-md mx-auto px-4">
      <div className="relative flex-grow h-10">
        {/* The Bar Container with uniform horizontal cylinder shape */}
        <div 
          className="absolute inset-0 bg-[#E0C3FF] border-[5px] border-[#982598] shadow-lg overflow-hidden"
          style={{ 
            borderRadius: '999px', // Uniform horizontal cylinder (pill shape)
          }}
        >
          {/* Filled part - Red/Orange */}
          <div 
            className="h-full bg-[#FF7070] transition-all duration-100 ease-linear"
            style={{ 
              width: `${progress * 100}%`,
            }}
          />
        </div>
        
        {/* Mascot Indicator - Outside the overflow-hidden container to stay visible */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-100 ease-linear z-10 pointer-events-none"
          style={{ 
            left: `calc(20px + (100% - 40px) * ${progress})` 
          }}
        >
          <MascotHead />
        </div>
      </div>
      
      <div className="flex-shrink-0">
        <RightBox />
      </div>
    </div>
  );
};

export default ProgressBar;
