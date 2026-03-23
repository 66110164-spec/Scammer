
import React from 'react';

const Mascot: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`relative flex items-center justify-center overflow-hidden rounded-full ${className}`}>
      {/* Background glow to match the theme */}
      <div className="absolute inset-0 bg-[#982598] opacity-20 blur-2xl rounded-full" />
      
      <img 
        src="https://emerald-accused-ostrich-896.mypinata.cloud/ipfs/bafybeig53qsq2wl5bl2xgzilwqahdyjy44wp4u5azz5npoabquf4btnbiq" 
        alt="Dizzy Scammer Mascot"
        className="w-full h-full object-contain relative z-10 drop-shadow-2xl animate-pulse"
        style={{ animationDuration: '0s' }}
      />
    </div>
  );
};

export default Mascot;
