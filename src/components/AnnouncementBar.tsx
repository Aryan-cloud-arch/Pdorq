import { useState } from 'react';

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-[#C5A572] via-[#d4b584] to-[#C5A572] text-[#0D0D0D] py-2 px-4 relative overflow-hidden">
      {/* Animated shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shine_3s_infinite]"></div>
      
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-4 relative">
        <span className="text-lg">🎉</span>
        <p className="font-outfit text-xs sm:text-sm font-medium text-center">
          <span className="hidden sm:inline">Limited Time Offer: </span>
          <span className="font-bold">Up to 92% OFF</span> on all services + 
          <span className="font-bold"> 5% extra</span> on crypto payments!
        </p>
        <a
          href="#order"
          className="hidden sm:inline-flex items-center gap-1 px-3 py-1 bg-[#0D0D0D] text-white rounded-full text-xs font-outfit font-medium hover:bg-[#1a1a1a] transition-colors"
        >
          Order Now
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
        
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-0 sm:right-4 p-1 hover:bg-black/10 rounded transition-colors"
          aria-label="Close announcement"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <style>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          50%, 100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
