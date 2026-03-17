interface NotFoundPageProps {
  onNavigate: (page: string) => void;
}

export default function NotFoundPage({ onNavigate }: NotFoundPageProps) {
  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* 404 Number */}
        <div className="relative mb-8">
          <span className="font-cormorant text-[150px] sm:text-[200px] font-light text-[#C5A572]/10 leading-none select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-cormorant text-6xl sm:text-8xl text-[#C5A572]">404</span>
          </div>
        </div>

        {/* Message */}
        <h1 className="font-cormorant text-3xl sm:text-4xl text-white mb-4">
          Page Not <span className="italic text-[#C5A572]">Found</span>
        </h1>
        <p className="font-outfit text-white/60 mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => onNavigate('home')}
            className="px-8 py-3 bg-gradient-to-r from-[#C5A572] to-[#8B7355] text-[#0D0D0D] font-outfit font-medium rounded-lg hover:shadow-lg hover:shadow-[#C5A572]/20 transition-all"
          >
            Back to Home
          </button>
          <button
            onClick={() => onNavigate('contact')}
            className="px-8 py-3 border border-white/20 text-white font-outfit rounded-lg hover:border-[#C5A572] hover:text-[#C5A572] transition-all"
          >
            Contact Support
          </button>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="font-outfit text-xs text-white/40 uppercase tracking-wider mb-4">Quick Links</p>
          <div className="flex flex-wrap gap-4 justify-center">
            {['Services', 'Pricing', 'Reviews', 'FAQ'].map((link) => (
              <button
                key={link}
                onClick={() => onNavigate(link.toLowerCase())}
                className="font-outfit text-sm text-white/60 hover:text-[#C5A572] transition-colors"
              >
                {link}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
