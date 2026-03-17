export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-[#0D0D0D] z-[200] flex items-center justify-center">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="relative mb-8">
          <div className="w-20 h-20 border-2 border-[#C5A572]/20 rounded-full animate-ping absolute inset-0" />
          <div className="w-20 h-20 border-2 border-[#C5A572]/40 rounded-full animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-cormorant text-2xl text-[#C5A572] font-light tracking-wider">P</span>
          </div>
        </div>

        {/* Loading Text */}
        <div className="flex items-center gap-2 justify-center">
          <span className="font-outfit text-sm text-white/60 tracking-wider uppercase">Loading</span>
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-[#C5A572] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 bg-[#C5A572] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 bg-[#C5A572] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
}
