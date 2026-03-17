import React from 'react';
import { platforms } from '../data/platforms';
import { getPlatformIcon } from './Icons';
import { Platform, Currency, formatPrice } from '../types';

interface ServicesProps {
  onSelectPlatform: (platform: Platform) => void;
  currency: Currency;
}

// Helper to calculate discounted price
const getDiscountedPrice = (price: number, discount: number) => {
  return Math.round(price * (1 - discount / 100));
};

const Services: React.FC<ServicesProps> = ({ onSelectPlatform, currency }) => {
  // Show first 8 platforms
  const displayPlatforms = platforms.slice(0, 8);

  return (
    <section id="services" className="py-20 md:py-32 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-20">
          <span 
            className="inline-block text-[10px] sm:text-xs tracking-[0.4em] text-[#8B7355] uppercase mb-4 md:mb-6"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Our Expertise
          </span>
          <h2 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#0D0D0D] tracking-[0.02em] mb-4 md:mb-6"
            style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300 }}
          >
            Platform <em className="italic text-[#C5A572]">Takedowns</em>
          </h2>
          <p 
            className="text-sm sm:text-base text-[#0D0D0D]/60 max-w-2xl mx-auto"
            style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}
          >
            Select a platform to view available services and TAT (Turnaround Time)
          </p>

          {/* Limited Time Offer Banner */}
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#C5A572]/20 to-[#8B7355]/20 border border-[#C5A572]/30 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A572] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C5A572]"></span>
            </span>
            <span 
              className="text-[10px] sm:text-xs tracking-[0.2em] text-[#8B7355] uppercase"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Limited Time: Up to 85% Off All Services
            </span>
          </div>
        </div>

        {/* Platform Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {displayPlatforms.map((platform, index) => {
            const minOriginalPrice = Math.min(...platform.services.map(s => s.price));
            const maxDiscount = Math.max(...platform.services.map(s => s.discount));
            const minDiscountedPrice = Math.min(...platform.services.map(s => getDiscountedPrice(s.price, s.discount)));

            return (
              <button
                key={platform.id}
                onClick={() => onSelectPlatform(platform)}
                className="group relative bg-white p-6 md:p-8 border border-[#0D0D0D]/10 hover:border-[#C5A572] hover:bg-[#0D0D0D] transition-all duration-500 text-left overflow-hidden"
              >
                {/* Discount Badge */}
                <div className="absolute top-0 right-0 bg-gradient-to-br from-[#C5A572] to-[#8B7355] text-white px-2 py-1 text-[9px] tracking-[0.1em] uppercase font-medium" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Up to {maxDiscount}% Off
                </div>

                {/* Roman Numeral */}
                <span 
                  className="absolute top-4 left-4 text-[10px] tracking-[0.2em] text-[#0D0D0D]/30 group-hover:text-white/30 transition-colors duration-500"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  {['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'][index]}
                </span>

                {/* Platform Icon */}
                <div className="mb-4 md:mb-6 mt-4 text-[#0D0D0D]/80 group-hover:text-[#C5A572] transition-colors duration-500">
                  {getPlatformIcon(platform.id, "w-8 h-8 md:w-10 md:h-10")}
                </div>

                {/* Platform Name */}
                <h3 
                  className="text-lg sm:text-xl md:text-2xl text-[#0D0D0D] group-hover:text-white mb-2 transition-colors duration-500"
                  style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
                >
                  {platform.name}
                </h3>

                {/* Services Count */}
                <p 
                  className="text-[10px] sm:text-xs tracking-[0.15em] text-[#0D0D0D]/50 group-hover:text-white/50 uppercase mb-4 transition-colors duration-500"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  {platform.services.length} Services Available
                </p>

                {/* Service List Preview with Prices */}
                <div className="space-y-1.5">
                  {platform.services.slice(0, 3).map((service) => {
                    const discountedPrice = getDiscountedPrice(service.price, service.discount);
                    return (
                      <div 
                        key={service.id}
                        className="flex items-center justify-between text-[10px] transition-colors duration-500"
                        style={{ fontFamily: 'Outfit, sans-serif' }}
                      >
                        <span className="truncate pr-2 text-[#0D0D0D]/50 group-hover:text-white/50">{service.name}</span>
                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                          <span className="line-through text-[#0D0D0D]/30 group-hover:text-white/30">{formatPrice(service.price, currency)}</span>
                          <span className="text-[#C5A572] font-medium">{formatPrice(discountedPrice, currency)}</span>
                        </div>
                      </div>
                    );
                  })}
                  {platform.services.length > 3 && (
                    <div 
                      className="text-[10px] text-[#C5A572]"
                      style={{ fontFamily: 'Outfit, sans-serif' }}
                    >
                      +{platform.services.length - 3} more services
                    </div>
                  )}
                </div>

                {/* Starting Price with Discount */}
                <div className="mt-4 pt-3 border-t border-[#0D0D0D]/10 group-hover:border-white/10 transition-colors duration-500">
                  <div className="flex items-end justify-between">
                    <div>
                      <span 
                        className="text-[8px] tracking-[0.1em] text-[#0D0D0D]/40 group-hover:text-white/40 uppercase block transition-colors duration-500"
                        style={{ fontFamily: 'Outfit, sans-serif' }}
                      >
                        Starting from
                      </span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span 
                          className="text-sm text-[#0D0D0D]/40 group-hover:text-white/40 line-through transition-colors duration-500"
                          style={{ fontFamily: 'Cormorant Garamond, serif' }}
                        >
{formatPrice(minOriginalPrice, currency)}
                         </span>
                         <span 
                           className="text-2xl text-[#C5A572]"
                           style={{ fontFamily: 'Cormorant Garamond, serif' }}
                         >
                           {formatPrice(minDiscountedPrice, currency)}
                        </span>
                      </div>
                    </div>
                    <span 
                      className="text-[9px] tracking-[0.1em] text-green-600 group-hover:text-green-400 uppercase bg-green-600/10 group-hover:bg-green-400/10 px-1.5 py-0.5 rounded transition-colors duration-500"
                      style={{ fontFamily: 'Outfit, sans-serif' }}
                    >
                      Save {maxDiscount}%
                    </span>
                  </div>
                </div>

                {/* Hover Arrow */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-500">
                  <svg className="w-5 h-5 text-[#C5A572]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </button>
            );
          })}
        </div>

        {/* View All Platforms */}
        <div className="text-center mt-10 md:mt-14">
          <p 
            className="text-xs tracking-[0.2em] text-[#0D0D0D]/50 uppercase"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Supporting {platforms.length} platforms • Click any platform to order
          </p>
        </div>

        {/* TAT Explanation */}
        <div className="mt-12 md:mt-16 text-center p-6 md:p-8 bg-[#0D0D0D]/5 border border-[#0D0D0D]/10">
          <span 
            className="text-[10px] sm:text-xs tracking-[0.3em] text-[#8B7355] uppercase"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            TAT = Turnaround Time
          </span>
          <p 
            className="mt-2 text-sm text-[#0D0D0D]/60"
            style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}
          >
            Estimated time from order confirmation to successful takedown completion
          </p>
        </div>
      </div>
    </section>
  );
};

export default Services;
