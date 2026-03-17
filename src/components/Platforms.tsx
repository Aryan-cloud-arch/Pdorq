import React from 'react';
import { platforms } from '../data/platforms';
import { getPlatformIcon } from './Icons';
import { Platform, Service, Currency, formatPrice } from '../types';

interface PlatformsProps {
  onSelectService: (platform: Platform, service: Service) => void;
  currency: Currency;
}

// Helper to calculate discounted price
const getDiscountedPrice = (price: number, discount: number) => {
  return Math.round(price * (1 - discount / 100));
};

const Platforms: React.FC<PlatformsProps> = ({ onSelectService, currency }) => {
  return (
    <section id="platforms" className="py-20 md:py-32 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-20">
          <span 
            className="inline-block text-[10px] sm:text-xs tracking-[0.4em] text-[#8B7355] uppercase mb-4 md:mb-6"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            All Platforms
          </span>
          <h2 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#0D0D0D] tracking-[0.02em] mb-4 md:mb-6"
            style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300 }}
          >
            Complete <em className="italic text-[#C5A572]">Coverage</em>
          </h2>
          <p 
            className="text-sm sm:text-base text-[#0D0D0D]/60 max-w-2xl mx-auto"
            style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}
          >
            Click on any service to start your order with TAT (Turnaround Time) displayed
          </p>

          {/* Discount Banner */}
          <div className="mt-6 inline-flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-full">
            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span 
              className="text-[10px] sm:text-xs tracking-[0.15em] text-green-700 uppercase font-medium"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Limited Time Offer: 50-85% Discount on All Services
            </span>
          </div>
        </div>

        {/* Platforms List */}
        <div className="space-y-6 md:space-y-8">
          {platforms.map((platform) => {
            const maxDiscount = Math.max(...platform.services.map(s => s.discount));
            const minDiscountedPrice = Math.min(...platform.services.map(s => getDiscountedPrice(s.price, s.discount)));
            const maxDiscountedPrice = Math.max(...platform.services.map(s => getDiscountedPrice(s.price, s.discount)));

            return (
              <div 
                key={platform.id}
                className="bg-white border border-[#0D0D0D]/10 overflow-hidden"
              >
                {/* Platform Header */}
                <div className="flex items-center gap-4 p-4 md:p-6 border-b border-[#0D0D0D]/10 bg-[#0D0D0D]/[0.02]">
                  <div className="text-[#0D0D0D]/80">
                    {getPlatformIcon(platform.id, "w-6 h-6 md:w-8 md:h-8")}
                  </div>
                  <h3 
                    className="text-xl md:text-2xl text-[#0D0D0D]"
                    style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 500 }}
                  >
                    {platform.name}
                  </h3>
                  
                  {/* Discount Badge */}
                  <span 
                    className="px-2 py-0.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-[9px] tracking-[0.1em] uppercase font-medium rounded-sm"
                    style={{ fontFamily: 'Outfit, sans-serif' }}
                  >
                    Up to {maxDiscount}% Off
                  </span>

                  <div className="ml-auto flex items-center gap-4">
                    <span 
                      className="text-[10px] tracking-[0.15em] text-[#0D0D0D]/40 uppercase hidden sm:block"
                      style={{ fontFamily: 'Outfit, sans-serif' }}
                    >
                      {platform.services.length} Services
                    </span>
                    <span 
                      className="text-sm text-[#C5A572] hidden md:block"
                      style={{ fontFamily: 'Cormorant Garamond, serif' }}
                    >
                      ${minDiscountedPrice} — ${maxDiscountedPrice}
                    </span>
                  </div>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {platform.services.map((service, index) => {
                    const discountedPrice = getDiscountedPrice(service.price, service.discount);
                    
                    return (
                      <button
                        key={service.id}
                        onClick={() => onSelectService(platform, service)}
                        className={`group p-4 md:p-5 text-left hover:bg-[#0D0D0D] transition-all duration-300 ${
                          index !== platform.services.length - 1 ? 'border-b sm:border-b-0 sm:border-r border-[#0D0D0D]/10' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 
                            className="text-sm md:text-base text-[#0D0D0D] group-hover:text-white transition-colors duration-300"
                            style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 500 }}
                          >
                            {service.name}
                          </h4>
                          {/* Price with Discount */}
                          <div className="flex flex-col items-end">
                            <span 
                              className="text-xs text-[#0D0D0D]/40 group-hover:text-white/40 line-through transition-colors duration-300"
                              style={{ fontFamily: 'Outfit, sans-serif' }}
                            >
{formatPrice(service.price, currency)}
                             </span>
                             <span 
                               className="text-lg text-[#C5A572] font-semibold"
                               style={{ fontFamily: 'Cormorant Garamond, serif' }}
                             >
                               {formatPrice(discountedPrice, currency)}
                            </span>
                          </div>
                        </div>
                        <p 
                          className="text-[10px] sm:text-xs text-[#0D0D0D]/50 group-hover:text-white/50 transition-colors duration-300 leading-relaxed mb-2"
                          style={{ fontFamily: 'Outfit, sans-serif' }}
                        >
                          {service.description}
                        </p>
                        {/* TAT and Discount Badge */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span 
                              className="text-[9px] tracking-[0.1em] text-[#C5A572] whitespace-nowrap px-2 py-0.5 bg-[#C5A572]/10 group-hover:bg-[#C5A572]/20 transition-colors duration-300"
                              style={{ fontFamily: 'Outfit, sans-serif' }}
                            >
                              TAT: {service.tat}
                            </span>
                            <span 
                              className="text-[9px] tracking-[0.05em] text-green-600 group-hover:text-green-400 whitespace-nowrap px-1.5 py-0.5 bg-green-500/10 group-hover:bg-green-500/20 transition-colors duration-300 font-medium"
                              style={{ fontFamily: 'Outfit, sans-serif' }}
                            >
                              {service.discount}% OFF
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-[#C5A572] opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                            <span 
                              className="text-[9px] tracking-[0.15em] uppercase"
                              style={{ fontFamily: 'Outfit, sans-serif' }}
                            >
                              Order
                            </span>
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* TAT Legend */}
        <div className="mt-10 md:mt-14 flex flex-wrap items-center justify-center gap-4 md:gap-8 p-4 md:p-6 bg-[#0D0D0D]/5 border border-[#0D0D0D]/10">
          <div className="flex items-center gap-2">
            <span 
              className="text-[10px] tracking-[0.2em] text-[#0D0D0D]/60 uppercase"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              TAT = Turnaround Time
            </span>
          </div>
          <div className="w-px h-4 bg-[#0D0D0D]/20 hidden md:block" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span 
              className="text-[10px] text-[#0D0D0D]/60"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Fast (&lt;12h)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span 
              className="text-[10px] text-[#0D0D0D]/60"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Standard (12-48h)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <span 
              className="text-[10px] text-[#0D0D0D]/60"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Extended (&gt;48h)
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Platforms;
