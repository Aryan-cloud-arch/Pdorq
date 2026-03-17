import React from 'react';
import { TelegramIcon } from './Icons';

const Support: React.FC = () => {
  return (
    <section id="contact" className="py-20 md:py-32 bg-[#FAF9F6]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Section Header */}
        <span 
          className="inline-block text-[10px] sm:text-xs tracking-[0.4em] text-[#8B7355] uppercase mb-4 md:mb-6"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          Support Only
        </span>
        <h2 
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#0D0D0D] tracking-[0.02em] mb-4 md:mb-6"
          style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300 }}
        >
          Need <em className="italic text-[#C5A572]">Assistance?</em>
        </h2>
        <p 
          className="text-sm sm:text-base text-[#0D0D0D]/60 max-w-xl mx-auto mb-10 md:mb-14"
          style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}
        >
          All orders must be placed through our website. Contact support for questions, order status, or technical assistance only.
        </p>

        {/* Telegram Contact */}
        <a
          href="https://t.me/pdorq"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6 px-8 sm:px-12 py-6 sm:py-8 bg-[#0D0D0D] hover:bg-[#C5A572] transition-all duration-500"
        >
          <div className="p-3 border border-white/20 group-hover:border-[#0D0D0D]/20 transition-colors">
            <TelegramIcon className="w-8 h-8 text-[#C5A572] group-hover:text-[#0D0D0D] transition-colors" />
          </div>
          <div className="text-center sm:text-left">
            <span 
              className="block text-[10px] tracking-[0.3em] text-white/50 group-hover:text-[#0D0D0D]/50 uppercase mb-1 transition-colors"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Telegram Support
            </span>
            <span 
              className="text-2xl sm:text-3xl text-white group-hover:text-[#0D0D0D] tracking-[0.05em] transition-colors"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              @pdorq
            </span>
          </div>
          <svg 
            className="w-6 h-6 text-[#C5A572] group-hover:text-[#0D0D0D] transform group-hover:translate-x-2 transition-all hidden sm:block" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>

        {/* Trust Badges */}
        <div className="mt-12 md:mt-16 flex flex-wrap justify-center gap-6 md:gap-10">
          {[
            { icon: '🔒', label: 'Encrypted Communications' },
            { icon: '⚡', label: '24/7 Available' },
            { icon: '🌍', label: 'Worldwide Operations' },
            { icon: '👁️', label: 'Full Anonymity' },
          ].map((badge, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-lg">{badge.icon}</span>
              <span 
                className="text-[10px] sm:text-xs tracking-[0.15em] text-[#0D0D0D]/60 uppercase"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                {badge.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Support;
