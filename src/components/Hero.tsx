import React from 'react';
import { platforms } from '../data/platforms';
import { getPlatformIcon } from './Icons';

interface HeroProps {
  onOrderClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOrderClick }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#0D0D0D] overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#C5A572]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#C5A572]/3 rounded-full blur-[100px]" />
      </div>

      {/* Ghost Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span 
          className="text-[15vw] md:text-[12vw] tracking-[0.2em] text-white/[0.02] whitespace-nowrap"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          TAKEDOWN
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-16 md:pb-24">
        <div className="text-center">
          {/* Tagline */}
          <div className="mb-6 md:mb-8">
            <span 
              className="inline-block text-[10px] sm:text-xs tracking-[0.4em] sm:tracking-[0.5em] text-[#C5A572] uppercase"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Professional Content Removal Services
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="mb-6 md:mb-8">
            <span 
              className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white tracking-[0.02em] leading-[1.1]"
              style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300 }}
            >
              We Take{' '}
              <em 
                className="not-italic bg-gradient-to-r from-[#C5A572] via-[#E8D5B5] to-[#C5A572] bg-clip-text text-transparent"
                style={{ fontStyle: 'italic' }}
              >
                Them
              </em>
              {' '}Down
            </span>
          </h1>

          {/* Subtitle */}
          <p 
            className="text-base sm:text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-8 md:mb-12 leading-relaxed px-4"
            style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}
          >
            Swift, discreet, and effective takedown services across all major platforms. 
            Submit your order directly on our secure platform.
          </p>

          {/* Platform Pills */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 md:mb-14 px-4">
            {platforms.slice(0, 6).map((platform) => (
              <div
                key={platform.id}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-full hover:border-[#C5A572]/50 hover:bg-[#C5A572]/10 transition-all duration-300 cursor-default"
              >
                <span className="text-[#C5A572]">
                  {getPlatformIcon(platform.id, "w-4 h-4")}
                </span>
                <span 
                  className="text-[10px] sm:text-xs tracking-[0.15em] text-white/70 uppercase"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  {platform.name}
                </span>
              </div>
            ))}
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-full">
              <span 
                className="text-[10px] sm:text-xs tracking-[0.15em] text-white/50 uppercase"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                +{platforms.length - 6} More
              </span>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={onOrderClick}
            className="group inline-flex items-center gap-3 sm:gap-4 px-8 sm:px-10 md:px-14 py-4 sm:py-5 bg-gradient-to-r from-[#C5A572] to-[#B8956A] text-[#0D0D0D] text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase hover:shadow-[0_0_60px_rgba(197,165,114,0.4)] transition-all duration-500"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            <span className="text-lg sm:text-xl">+</span>
            Place an Order
            <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>

          {/* Trust Indicators */}
          <div className="mt-12 md:mt-16 flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-12 text-center">
            {[
              { value: '12,400+', label: 'Takedowns' },
              { value: '99.2%', label: 'Success Rate' },
              { value: '<6h', label: 'Avg. Response' },
              { value: '24/7', label: 'Operations' },
            ].map((stat, i) => (
              <div key={i} className="px-2">
                <div 
                  className="text-2xl sm:text-3xl md:text-4xl text-[#C5A572] mb-1"
                  style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300 }}
                >
                  {stat.value}
                </div>
                <div 
                  className="text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] text-white/40 uppercase"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 animate-bounce">
        <span 
          className="text-[10px] tracking-[0.3em] text-white/30 uppercase"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          Scroll
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
      </div>
    </section>
  );
};

export default Hero;
