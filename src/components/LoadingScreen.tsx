import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onFinished?: () => void;
  durationMs?: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  onFinished, 
  durationMs = 5000 
}) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        if (onFinished) onFinished();
      }, 400); // 400ms smooth fade-out
    }, durationMs);

    return () => clearTimeout(timer);
  }, [durationMs, onFinished]);

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white text-slate-900 transition-opacity duration-500 select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Subtle Soft Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />

      {/* Main Center Container */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
        
        {/* Clock Logo - Matching Main App Header Logo Style */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-blue-50 border border-blue-200/90 flex items-center justify-center text-[#3C83F6] shadow-xl shadow-blue-500/10">
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="w-10 h-10 sm:w-12 sm:h-12 text-[#3C83F6]"
          >
            {/* Stopwatch top button & stem (Stationary) */}
            <path d="M10 2h4" strokeWidth="2.2" />
            <path d="M12 2v2" strokeWidth="2.2" />
            
            {/* Clock Outer Face (Stationary) */}
            <circle cx="12" cy="14" r="8" strokeWidth="2" className="stroke-[#3C83F6]" />
            
            {/* Hour hand (Static) */}
            <line x1="12" y1="14" x2="12" y2="9.2" strokeWidth="2.5" stroke="#3C83F6" strokeLinecap="round" />
            
            {/* Second hand / Pin spinning rapidly around center */}
            <g style={{ transformOrigin: '12px 14px' }} className="animate-[spin_0.5s_linear_infinite]">
              <line x1="12" y1="14" x2="17.2" y2="14" strokeWidth="2.2" stroke="#3C83F6" strokeLinecap="round" />
            </g>

            {/* Center Pivot Dot */}
            <circle cx="12" cy="14" r="1.3" fill="#3C83F6" />
          </svg>
        </div>

        {/* Text: Flow Track */}
        <h1 className="text-2xl sm:text-3xl font-serif font-extrabold tracking-tight text-slate-900">
          Flow Track
        </h1>

      </div>
    </div>
  );
};
